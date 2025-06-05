import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";

export class SkipCommand extends Command {
    name = "skip";
    description = "Salta la canción actual.";
    categories = ["music"];
    usage = "skip";
    async execute({ message, interaction }: CommandParameters): Promise<void> {
        const musicService = ServiceContainer.getService(MusicService);
        const member = message?.member ?? interaction?.member;
        const voiceChannel = (member as any)?.voice?.channel;
        if (!voiceChannel) {
            const reply = "❌ Debes estar en un canal de voz para usar este comando.";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        try {
            await musicService.distube.skip(voiceChannel);
            const reply = `⏭️ Canción saltada.`;
            if (interaction) await interaction.reply({ content: reply });
            if (message) await message.reply(reply);
        } catch (e) {
            const reply = `❌ No se pudo saltar la canción: ${e}`;
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
        }
    }
}
