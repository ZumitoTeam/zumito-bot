import { EmbedBuilder } from "zumito-framework/discord";
import { SetupState } from "./SetupState";

export class SetupEmbedBuilder {
    getEmbed(state: SetupState, description: string) {
        return new EmbedBuilder()
            .setTitle("Configuración del panel")
            .setDescription(`${description}\n\nNombre actual: **${state.name || "Sin nombre"}**`)
            .setColor("#5865F2");
    }
}
