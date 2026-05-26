import { Listener, Events } from '@sapphire/framework';
import type { Client } from 'discord.js';

const BOT_ROLE_COLOR = 0xf5f5f5;

export class ReadyListener extends Listener<typeof Events.ClientReady> {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, { ...options, once: true, event: Events.ClientReady });
  }

  public override async run(client: Client<true>): Promise<void> {
    this.container.logger.info(`Logged in as ${client.user.tag} (${client.user.id})`);
    this.container.logger.info(`Guilds: ${client.guilds.cache.size}`);

    for (const guild of client.guilds.cache.values()) {
      const botRole = guild.roles.cache.find(
        (r) => r.managed && r.tags?.botId === client.user.id,
      );
      if (botRole && botRole.color !== BOT_ROLE_COLOR) await botRole.setColor(BOT_ROLE_COLOR);
    }
  }
}
