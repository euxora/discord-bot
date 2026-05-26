import { Command } from '@sapphire/framework';
import { PermissionFlagsBits, ChannelType, MessageFlags } from 'discord.js';
import type { ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { COMPONENTS_V2_FLAGS, Container, Section, Text, Thumbnail, Separator, Row, Button } from '#lib/utils/ui';
import { Emojis } from '#lib/emojis';

export class VerifyCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options, description: 'Envía el mensaje de verificación a un canal' });
  }

  public override registerApplicationCommands(registry: Command.Registry): void {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('verify')
        .setDescription(this.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption((option) =>
          option
            .setName('channel')
            .setDescription('Canal donde enviar el mensaje de verificación')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true),
        ),
    );
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction): Promise<void> {
    const channel = interaction.options.getChannel('channel', true) as TextChannel;
    const guildId = interaction.guildId!;

    const guild = await this.container.prisma.guild.findUnique({
      where: { id: guildId },
      select: { verifyChannelId: true, verifyMessageId: true },
    });

    if (guild?.verifyChannelId && guild.verifyMessageId) {
      try {
        const oldChannel = await interaction.guild!.channels.fetch(guild.verifyChannelId) as TextChannel | null;
        const oldMessage = await oldChannel?.messages.fetch(guild.verifyMessageId);
        await oldMessage?.delete();
      } catch {
      }
    }

    const sent = await channel.send({
      flags: COMPONENTS_V2_FLAGS,
      components: [
        Container([
          Section(
            [
              Text(
                '## VERIFICACIÓN\n\nBienvenido/a al servidor.\n\nEl buen ambiente y la seguridad de nuestra comunidad son una prioridad. Por ello, necesitamos que completes una breve verificación antes de acceder al servidor.\n\nUna vez verificado/a, tendrás acceso completo a todos los canales y funciones.',
              ),
            ],
            Thumbnail('https://i.imgur.com/Krr2yTu.png'),
          ),
          Separator(2),
          Row([Button('verify:role', 'Toca para verificarte', 1, Emojis.verify)]),
        ]),
      ],
    });

    await this.container.prisma.guild.upsert({
      where: { id: guildId },
      create: { id: guildId, verifyChannelId: channel.id, verifyMessageId: sent.id },
      update: { verifyChannelId: channel.id, verifyMessageId: sent.id },
    });

    await interaction.reply({
      flags: COMPONENTS_V2_FLAGS | MessageFlags.Ephemeral,
      components: [Container([Text(`Mensaje de verificación enviado a <#${channel.id}>.`)])],
    });
  }
}
