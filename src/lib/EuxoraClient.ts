import { SapphireClient, container } from '@sapphire/framework';
import '@sapphire/plugin-scheduled-tasks/register';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-i18next/register';
import { GatewayIntentBits, Partials, ActivityType } from 'discord.js';
import { config } from '#config';
import { prisma } from '#prisma';
import { redis } from '#redis';
import { moderationQueue, createModerationWorker } from '#queues/index';
import type { Worker } from 'bullmq';

export class EuxoraClient extends SapphireClient {
  private workers: Worker[] = [];

  public constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.GuildMember],
      presence: {
        activities: [{ name: 'the server', type: ActivityType.Watching }],
      },
      loadMessageCommandListeners: true,
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
        level: config.NODE_ENV === 'development' ? 10 : 20,
      },
    });
  }

  public override async login(token?: string): Promise<string> {
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

    await redis.connect();
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
