import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export class ModalBuilderService {
    buildExampleModal(): ModalBuilder {
        const modal = new ModalBuilder()
            .setCustomId('ejemplo.modal_ejemplo')
            .setTitle('Modal de Ejemplo');

        const nombreInput = new TextInputBuilder()
            .setCustomId('nombre')
            .setLabel('¿Cuál es tu nombre?')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ingresa tu nombre aquí')
            .setRequired(true);

        const descripcionInput = new TextInputBuilder()
            .setCustomId('descripcion')
            .setLabel('Describe algo')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Escribe una breve descripción...')
            .setRequired(false);

        const nombreRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(nombreInput);

        const descripcionRow = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(descripcionInput);

        modal.addComponents(nombreRow, descripcionRow);

        return modal;
    }
}