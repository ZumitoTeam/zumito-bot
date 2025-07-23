import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } from 'zumito-framework/discord';
import { Command, CommandParameters, CommandType, ModalSubmitParameters, ServiceContainer } from 'zumito-framework';
import { ConfessionService } from '../services/ConfessionService.js';

export class ConfessionCommand extends Command {
    name = 'confession';
    description = 'Send an anonymous confession';
    categories = ['utils'];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES'];
    type = CommandType.any;

    async execute({ interaction }: CommandParameters): Promise<void> {
        if (!interaction) return;
        const modal = new ModalBuilder()
            .setCustomId(`${this.name}.send`)
            .setTitle('Send Confession');

        const input = new TextInputBuilder()
            .setCustomId('confession')
            .setLabel('Your Confession')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const row: any = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
        modal.addComponents(row);
        await interaction.showModal(modal);
    }

    async modalSubmit({ interaction, path }: ModalSubmitParameters): Promise<void> {
        if (path[1] !== 'send') return;
        const confession = interaction.fields.getTextInputValue('confession');
        const service = ServiceContainer.getService(ConfessionService) as ConfessionService;
        const success = await service.sendConfession(interaction.guild!.id, confession);
        if (!success) {
            await interaction.reply({ content: 'Confession channel not configured.', flags: MessageFlags.Ephemeral });
            return;
        }
        await interaction.reply({ content: 'Your confession has been sent.', flags: MessageFlags.Ephemeral });
    }
}
