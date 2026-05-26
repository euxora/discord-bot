import { SapphireClient, container, ApplicationCommandRegistries, RegisterBehavior } from '@sapphire/framework';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import '@sapphire/plugin-scheduled-tasks/register';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-i18next/register';
import { GatewayIntentBits, Partials } from 'discord.js';
import { config } from '#config';
import { getCachedPrefix } from '#lib/cache/guild.cache';
import { prisma } from '#prisma';
import { redis } from '#redis';
import { moderationQueue, createModerationWorker } from '#queues/index';
import type { Worker } from 'bullmq';

export class EuxoraClient extends SapphireClient {
  private workers: Worker[] = [];

  public constructor() {
    ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);
    super({
      baseUserDirectory: new URL('../', import.meta.url),
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.GuildMember],
      presence: {
        status: 'dnd',
      },
      loadMessageCommandListeners: true,
      defaultPrefix: 'e!',
      fetchPrefix: async (message) => {
        if (!message.guildId) return 'e!';
        return getCachedPrefix(redis, prisma, message.guildId);
      },
      tasks: {
        bull: { connection: redis },
      },
      api: {
        listenOptions: { port: config.API_PORT },
        auth: {
          id: config.DISCORD_CLIENT_ID,
          secret: config.API_AUTH_TOKEN,
          cookie: 'EUXORA_AUTH',
          domainOverwrite: '127.0.0.1',
        },
      },
      i18n: {
        defaultLanguageDirectory: resolve(dirname(fileURLToPath(import.meta.url)), '../../languages'),
        fetchLanguage: async (context) => {
          if (!context.guild) return 'en-US';
          const guild = await prisma.guild.findUnique({
            where: { id: context.guild.id },
            select: { locale: true },
          });
          return guild?.locale ?? 'en-US';
        },
      },
      logger: {
        level: 30,
      },
    });
  }

  public override async login(token?: string): Promise<string> {
    for (const store of this.stores.values()) {
      store.strategy.supportedExtensions.push('.ts');
    }
    container.prisma = prisma;
    container.redis = redis;
    container.queues = { moderation: moderationQueue };

    this.workers.push(
      createModerationWorker(async (job) => {
        container.logger.info(`[ModerationWorker] processing job ${job.id}: ${job.data.type}`);
        const { handleModerationJob } = await import('../workers/moderation.worker.js');
        await handleModerationJob(job);
      }),
    );

    if (redis.status === 'wait') await redis.connect();
    return super.login(token);
  }

  public override async destroy(): Promise<void> {
    await Promise.all(this.workers.map((w) => w.close()));
    await redis.quit();
    await prisma.$disconnect();
    await super.destroy();
  }
}

declare module '@sapphire/framework' {
  interface Container {
    prisma: typeof prisma;
    redis: typeof redis;
    queues: { moderation: typeof moderationQueue };
  }
}
