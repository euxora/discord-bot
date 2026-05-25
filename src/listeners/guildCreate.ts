import { Listener, Events } from '@sapphire/framework';
import type { Guild } from 'discord.js';

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
    this.container.logger.info(`Joined guild: ${guild.name} (${guild.id})`);
  }
}
