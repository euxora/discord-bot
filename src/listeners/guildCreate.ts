import { Listener, Events } from '@sapphire/framework';
import type { Guild } from 'discord.js';

const BOT_ROLE_COLOR = 0xf5f5f5;

export class GuildCreateListener extends Listener<typeof Events.GuildCreate> {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, { ...options, event: Events.GuildCreate });
  }

  public override async run(guild: Guild): Promise<void> {
    await this.container.prisma.guild.upsert({
      where: { id: guild.id },
      create: { id: guild.id },
      update: {},
    });

    const botRole = guild.roles.cache.find(
      (r) => r.managed && r.tags?.botId === this.container.client.user?.id,
    );
    if (botRole) await botRole.setColor(BOT_ROLE_COLOR);

    this.container.logger.info(`Joined guild: ${guild.name} (${guild.id})`);
  }
}
