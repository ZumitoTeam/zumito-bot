import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";
import { MessageFlags } from "zumito-framework/discord";

export class PlayCommand extends Command {
    name = "play";
    description = "Reproduce una canción o playlist en tu canal de voz.";
    categories = ["music"];
    usage = "play <canción o URL>";
    args = [
        { name: "query", type: "string", optional: false }
    ];
    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        if (interaction) await interaction.deferReply();
        const musicService = ServiceContainer.getService(MusicService);
        const query = args.get("query");

        // Validar que el comando se use en un guild
        const guild = message?.guild ?? interaction?.guild;
        if (!guild) {
            const reply = "❌ Este comando solo puede usarse en servidores (no en mensajes directos).";
            if (interaction) await interaction.followUp({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }

        const member = message?.member || interaction?.member;
        // Validar que el usuario sea miembro del guild y esté en un canal de voz
        const voiceChannel = (member && "voice" in member) ? (member as any).voice.channel : null;
        if (!voiceChannel) {
            const reply = "❌ Debes estar en un canal de voz para usar este comando.";
            if (interaction) await interaction.followUp({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        try {
            await musicService.distube.play(voiceChannel, query, {});
            // Esperar un breve momento para que la canción se agregue a la cola
            let songName = query;
            const queue = musicService.distube.getQueue(guild.id);
            if (queue && queue.songs.length > 0) {
                songName = queue.songs[0].name;
            }
            const reply = `🎶 Reproduciendo: **${songName}**`;
            if (interaction) await interaction.followUp({ content: reply });
            if (message) await message.reply(reply);
            return;
        } catch (e) {
            const reply = `❌ Error al reproducir: ${e}`;
            if (interaction && await interaction.isRepliable()) await interaction.followUp({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
        }
    }
}
