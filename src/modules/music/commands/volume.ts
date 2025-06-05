import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";

export class VolumeCommand extends Command {
    name = "volume";
    description = "Cambia el volumen de la música (0-100).";
    categories = ["music"];
    usage = "volume <porcentaje>";
    args = [
        { name: "porcentaje", type: "number", optional: false }
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
        const porcentaje = Number(args.get("porcentaje"));
        if (!queue || isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
            const reply = "❌ Debes especificar un volumen entre 0 y 100.";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        queue.setVolume(porcentaje);
        const reply = `🔊 Volumen ajustado a ${porcentaje}%`;
        if (interaction) await interaction.reply({ content: reply });
        if (message) await message.reply(reply);
    }
}
