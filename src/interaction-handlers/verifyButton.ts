import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { MessageFlags } from 'discord.js';
import type { ButtonInteraction } from 'discord.js';
import { COMPONENTS_V2_FLAGS, Container, Text } from '#lib/utils/ui';

const VERIFIED_ROLE_ID = '1508668858800668772';

export class VerifyButtonHandler extends InteractionHandler {
  public constructor(context: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
    super(context, { ...options, interactionHandlerType: InteractionHandlerTypes.Button });
  }

  public override parse(interaction: ButtonInteraction) {
    if (interaction.customId !== 'verify:role') return this.none();
    return this.some();
  }

  public override async run(interaction: ButtonInteraction): Promise<void> {
    const member = await interaction.guild!.members.fetch(interaction.user.id);

    if (member.roles.cache.has(VERIFIED_ROLE_ID)) {
      await interaction.reply({
        flags: COMPONENTS_V2_FLAGS | MessageFlags.Ephemeral,
        components: [Container([Text('Ya estás verificado.')])],
      });
      return;
    }

    await member.roles.add(VERIFIED_ROLE_ID);

    await interaction.reply({
      flags: COMPONENTS_V2_FLAGS | MessageFlags.Ephemeral,
      components: [Container([Text('¡Te has verificado! Ya tienes acceso al servidor.')])],
    });
  }
}
