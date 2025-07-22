import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";
import { MessageFlags } from "zumito-framework/discord";

export class PlaytopCommand extends Command {
    name = "playtop";
    description = "Agrega una canción al principio de la cola.";
    categories = ["music"];
    usage = "playtop <canción o URL>";
    args = [
        { name: "query", type: "string", optional: false }
    ];
    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const musicService = ServiceContainer.getService(MusicService) as MusicService;
        const query = args.get("query");
        const member = message?.member ?? interaction?.member;
        const voiceChannel = (member as any)?.voice?.channel;
        if (!voiceChannel) {
            const reply = "❌ Debes estar en un canal de voz para usar este comando.";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        try {
            await musicService.distube.play(voiceChannel, query, { position: 1 });
            const reply = `🔝 Añadido al principio: **${query}**`;
            if (interaction) await interaction.reply({ content: reply });
            if (message) await message.reply(reply);
        } catch (e) {
            const reply = `❌ Error al añadir: ${e}`;
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
        }
    }
}
