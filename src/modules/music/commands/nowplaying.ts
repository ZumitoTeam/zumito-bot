import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";
import { MessageFlags } from "zumito-framework/discord";

export class NowPlayingCommand extends Command {
    name = "nowplaying";
    description = "Muestra la canción que se está reproduciendo actualmente.";
    categories = ["music"];
    usage = "nowplaying";
    async execute({ message, interaction }: CommandParameters): Promise<void> {
        const guild = message?.guild ?? interaction?.guild;
        if (!guild) {
            const reply = "❌ No se pudo determinar el servidor.";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        const musicService = ServiceContainer.getService(MusicService) as MusicService;
        const queue = musicService.distube.getQueue(guild.id);
        if (!queue || !queue.songs.length) {
            const reply = "❌ No hay ninguna canción en reproducción.";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        const song = queue.songs[0];
        const reply = `🎶 Ahora suena: **${song.name}** (${song.formattedDuration})\nSolicitado por: <@${song.user?.id || song.user || 'desconocido'}>\n${song.url}`;
        if (interaction) await interaction.reply({ content: reply });
        if (message) await message.reply(reply);
    }
}
