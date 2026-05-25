import { Listener, Events } from '@sapphire/framework';
import type { Client } from 'discord.js';

export class ReadyListener extends Listener<typeof Events.ClientReady> {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, { ...options, once: true, event: Events.ClientReady });
  }

  public override run(client: Client<true>): void {
    this.container.logger.info(`Logged in as ${client.user.tag} (${client.user.id})`);
    this.container.logger.info(`Guilds: ${client.guilds.cache.size}`);
  }
}
