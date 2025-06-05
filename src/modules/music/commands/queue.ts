import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";

export class QueueCommand extends Command {
    name = "queue";
    description = "Muestra la cola de canciones.";
    categories = ["music"];
    usage = "queue";
    async execute({ message, interaction }: CommandParameters): Promise<void> {
        const guild = message?.guild ?? interaction?.guild;
        if (!guild) {
            const reply = "No se pudo determinar el servidor (guild).";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        const musicService = ServiceContainer.getService(MusicService) as MusicService;
        const queue = musicService.distube.getQueue(guild.id);
        if (!queue || !queue.songs.length) {
            const reply = "📭 La cola está vacía.";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        const songs = queue.songs.map((s, i) => `${i === 0 ? '▶️' : `${i}.`} **${s.name}**`).join("\n");
        const reply = `🎶 **Cola de canciones:**\n${songs}`;
        if (interaction) await interaction.reply({ content: reply });
        if (message) await message.reply(reply);
    }
}
