import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";

export class AutoplayCommand extends Command {
    name = "autoplay";
    description = "Activa o desactiva el autoplay de la música.";
    categories = ["music"];
    usage = "autoplay <on|off>";
    args = [
        { name: "estado", type: "string", optional: false }
    ];
    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const musicService = ServiceContainer.getService(MusicService) as MusicService;
        const guild = message?.guild ?? interaction?.guild;
        if (!guild) {
            const reply = "❌ No se pudo determinar el servidor (guild).";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        const queue = musicService.distube.getQueue(guild.id);
        const estado = (args.get("estado") || "off").toLowerCase();
        if (!queue || !["on","off"].includes(estado)) {
            const reply = "❌ Debes elegir: on u off.";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        queue.toggleAutoplay();
        const reply = `🔁 Autoplay: ${queue.autoplay ? "activado" : "desactivado"}`;
        if (interaction) await interaction.reply({ content: reply });
        if (message) await message.reply(reply);
    }
}
