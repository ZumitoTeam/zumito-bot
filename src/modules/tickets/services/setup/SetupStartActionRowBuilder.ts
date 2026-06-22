import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "zumito-framework/discord";

export class SetupStartActionRowBuilder {
    getRow() {
        return new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("setup.create")
                .setLabel("Crear panel")
                .setStyle(ButtonStyle.Primary)
        );
    }
}
