import { ActionRowBuilder } from 'discord.js';
import { Command, CommandParameters, CommandBinds, ButtonPressedParams, ModalSubmitParameters, ServiceContainer } from 'zumito-framework';
import { EmbedBuilderService } from '../services/EmbedBuilderService.js';
import { ButtonBuilderService } from '../services/ButtonBuilderService.js';
import { ModalBuilderService } from '../services/ModalBuilderService.js';
import { CommandType } from 'zumito-framework';

export class ExampleCommand extends Command {
    name = "ejemplo";
    description = "Un comando de ejemplo con embeds, botones y modales";
    usage = "ejemplo";

    binds: CommandBinds = {
        buttonClick: this.buttonPressed.bind(this),
        modalSubmit: this.modalSubmit.bind(this),
    };

    type = CommandType.any;

    constructor(
        private embedBuilderService = ServiceContainer.getService(EmbedBuilderService),
        private buttonBuilderService = ServiceContainer.getService(ButtonBuilderService),
        private modalBuilderService = ServiceContainer.getService(ModalBuilderService)
    ) {
        super();
    }

    async execute({ interaction, message }: CommandParameters) {

        // Crear el embed usando el servicio
        const embed = this.embedBuilderService.buildExampleEmbed();

        // Crear el botón usando el servicio
        const button = this.buttonBuilderService.buildExampleButton();

        // Crear la fila de componentes
        const row = new ActionRowBuilder()
            .addComponents(button);

        // Responder con el embed y el botón
        await (interaction||message).reply({ 
            embeds: [embed], 
            components: [row.toJSON()] 
        });
    }

    // Acción al presionar el botón
    async buttonPressed({ interaction, path }: ButtonPressedParams): Promise<void> {
        if (path[1] === 'abrir_modal') {
            // Crear el modal usando el servicio
            const modal = this.modalBuilderService.buildExampleModal();
            // Mostrar el modal
            await interaction.showModal(modal);
        }
    }

    // Acción al enviar el modal
    async modalSubmit({ interaction, path }: ModalSubmitParameters): Promise<void> {
        if (path[1] === 'modal_ejemplo') {
            // Obtener los valores del modal
            const nombre = interaction.fields.getTextInputValue('nombre');
            const descripcion = interaction.fields.getTextInputValue('descripcion') || 'No proporcionada';

            // Crear un embed de respuesta usando el servicio
            const responseEmbed = this.embedBuilderService.buildResponseEmbed(nombre, descripcion);

            // Responder al modal submit
            await interaction.reply({ embeds: [responseEmbed], ephemeral: true });
        }
    }
}