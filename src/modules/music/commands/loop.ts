import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";

export class LoopCommand extends Command {
    name = "loop";
    description = "Activa o desactiva el loop de la canción o la cola.";
    categories = ["music"];
    usage = "loop <off|song|queue>";
    args = [
        { name: "modo", type: "string", optional: false }
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
        const modo = (args.get("modo") || "off").toLowerCase();
        if (!queue || !["off","song","queue"].includes(modo)) {
            const reply = "❌ Debes elegir: off, song o queue.";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        let modeNum = 0;
        if (modo === "song") modeNum = 1;
        if (modo === "queue") modeNum = 2;
        queue.setRepeatMode(modeNum);
        const reply = `🔁 Loop: ${modo}`;
        if (interaction) await interaction.reply({ content: reply });
        if (message) await message.reply(reply);
    }
}
