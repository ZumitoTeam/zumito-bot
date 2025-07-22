import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";

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
        const member = message?.member || interaction?.member;
        // Check if member is a GuildMember (has 'voice' property)
        const voiceChannel = (member && "voice" in member) ? (member as any).voice.channel : null;
        if (!voiceChannel) {
            const reply = "❌ Debes estar en un canal de voz para usar este comando.";
            if (interaction) await interaction.followUp({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        try {
            await musicService.distube.play(voiceChannel, query, {});
            // Esperar un breve momento para que la canción se agregue a la cola
            const guild = message?.guild ?? interaction?.guild;
            let songName = query;
            if (guild) {
                const queue = musicService.distube.getQueue(guild.id);
                if (queue && queue.songs.length > 0) {
                    songName = queue.songs[0].name;
                }
            }
            const reply = `🎶 Reproduciendo: **${songName}**`;
            if (interaction) await interaction.followUp({ content: reply });
            if (message) await message.reply(reply);
            return;
        } catch (e) {
            const reply = `❌ Error al reproducir: ${e}`;
            if (interaction && await interaction.isRepliable()) await interaction.followUp({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
        }
    }
}
