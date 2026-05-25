import { Command } from '@sapphire/framework';
import type { ChatInputCommandInteraction } from 'discord.js';

export class PingCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options, description: 'Check bot latency' });
  }

  public override registerApplicationCommands(registry: Command.Registry): void {
    registry.registerChatInputCommand((builder) =>
      builder.setName('ping').setDescription(this.description),
    );
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction): Promise<void> {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const wsLatency = this.container.client.ws.ping;

    await interaction.editReply(
      `Pong! Roundtrip: **${latency}ms** | WebSocket: **${wsLatency}ms**`,
    );
  }
}
