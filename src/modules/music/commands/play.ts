import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";
import { MessageFlags, EmbedBuilder } from "zumito-framework/discord";
import { CanvasUtils } from "../../utils/CanvasUtils";
import { CanvasRenderingContext2D } from "canvas";

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
            await musicService.distube.play(voiceChannel, query, { member });
            const queue = musicService.distube.getQueue(guild.id);
            if (!queue || queue.songs.length === 0) {
                throw new Error("No se pudo obtener la canción de la cola.");
            }
            const song = queue.songs[0];
            const width = 800;
            const height = 200;
            const canvasUtil = new CanvasUtils({ width, height, format: 'image/png' });
            const ctx = canvasUtil.getContext();

            // Draw background
            canvasUtil.drawBackground('#2C2F33', '#23272A');
            
            // Load and draw thumbnail
            const thumbnail = await CanvasUtils.loadImage(song.thumbnail);
            ctx.drawImage(thumbnail, 20, 20, 160, 160);

            // Draw song info
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 24px Arial';
            ctx.fillText(song.name, 200, 60, 580);

            ctx.font = '18px Arial';
            ctx.fillStyle = '#CCCCCC';
            ctx.fillText(`Duración: ${song.formattedDuration}`, 200, 95);
            ctx.fillText(`Solicitado por: ${song.user?.username || 'Desconocido'}`, 200, 125);

            const attachment = await canvasUtil.toAttachment('nowplaying.png');

            const embed = new EmbedBuilder()
                .setTitle('🎶 Reproduciendo Ahora')
                .setDescription(`[${song.name}](${song.url})`) // Link to the song
                .setColor('#FF0000') // You can customize the color
                .setImage('attachment://nowplaying.png');

            if (interaction) await interaction.followUp({ embeds: [embed], files: [attachment] });
            if (message) await message.reply({ embeds: [embed], files: [attachment] });
            return;
        } catch (e) {
            const reply = `❌ Error al reproducir: ${e}`;
            if (interaction && await interaction.isRepliable()) await interaction.followUp({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
        }
    }
}
