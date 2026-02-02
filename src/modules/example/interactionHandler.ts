// Este archivo muestra cómo manejar las interacciones del botón y modal.
// En un módulo real, esto se integraría en el sistema de eventos del framework.

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } from 'discord.js';
import { Client } from 'discord.js';
import { ServiceContainer } from 'zumito-framework';
import { EmbedBuilderService } from './services/EmbedBuilderService.js';

// Asumiendo que tienes acceso al client
export function setupInteractionHandlers(client: Client) {
    const embedBuilderService = ServiceContainer.getService(EmbedBuilderService) as EmbedBuilderService;

    client.on('interactionCreate', async (interaction) => {
        if (interaction.isButton()) {
            if (interaction.customId === 'abrir_modal') {
                // Crear el modal
                const modal = new ModalBuilder()
                    .setCustomId('modal_ejemplo')
                    .setTitle('Modal de Ejemplo');

                // Crear inputs para el modal
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

                // Crear filas para los inputs
                const nombreRow = new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(nombreInput);

                const descripcionRow = new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(descripcionInput);

                // Añadir componentes al modal
                modal.addComponents(nombreRow, descripcionRow);

                // Mostrar el modal
                await interaction.showModal(modal);
            }
        } else if (interaction.type === InteractionType.ModalSubmit) {
            if (interaction.customId === 'modal_ejemplo') {
                // Obtener los valores del modal
                const nombre = interaction.fields.getTextInputValue('nombre');
                const descripcion = interaction.fields.getTextInputValue('descripcion') || 'No proporcionada';

                // Crear un embed de respuesta usando el servicio
                const responseEmbed = embedBuilderService.buildResponseEmbed(nombre, descripcion);

                // Responder al modal submit
                await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
            }
        }
    });
}