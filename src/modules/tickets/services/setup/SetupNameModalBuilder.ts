import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "zumito-framework/discord";

export class SetupNameModalBuilder {
    getModal(defaultName: string) {
        const modal = new ModalBuilder()
            .setCustomId("setup.name")
            .setTitle("Nombre del panel");

        const nameInput = new TextInputBuilder()
            .setCustomId("name")
            .setLabel("Nombre del panel")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(defaultName);

        const row: any = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
        modal.addComponents(row);
        return modal;
    }
}
