import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";

export class MoveCommand extends Command {
    name = "move";
    description = "Mueve una canción de una posición a otra en la cola.";
    categories = ["music"];
    usage = "move <de> <a>";
    args = [
        { name: "de", type: "number", optional: false },
        { name: "a", type: "number", optional: false }
    ];
    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const musicService = ServiceContainer.getService(MusicService) as MusicService;
        const guild = message?.guild ?? interaction?.guild;
        if (!guild) {
            const reply = "❌ No se pudo determinar el servidor.";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        const queue = musicService.distube.getQueue(guild.id);
        const de = Number(args.get("de"));
        const a = Number(args.get("a"));
        if (!queue || isNaN(de) || isNaN(a) || de < 1 || de >= queue.songs.length || a < 1 || a >= queue.songs.length) {
            const reply = "❌ Posiciones inválidas.";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        const song = queue.songs.splice(de, 1)[0];
        queue.songs.splice(a, 0, song);
        const reply = `🔀 Canción movida a la posición ${a}: **${song.name}**`;
        if (interaction) await interaction.reply({ content: reply });
        if (message) await message.reply(reply);
    }
}
