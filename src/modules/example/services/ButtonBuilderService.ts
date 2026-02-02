import { ButtonBuilder, ButtonStyle } from 'discord.js';

export class ButtonBuilderService {
    buildExampleButton(): ButtonBuilder {
        return new ButtonBuilder()
            .setCustomId('ejemplo.abrir_modal')
            .setLabel('Abrir Modal')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📝');
    }
}