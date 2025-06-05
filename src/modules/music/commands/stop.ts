import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";

export class StopCommand extends Command {
    name = "stop";
    description = "Detiene la música y sale del canal de voz.";
    categories = ["music"];
    usage = "stop";
    async execute({ message, interaction }: CommandParameters): Promise<void> {
        const musicService = ServiceContainer.getService(MusicService) as MusicService;
        const member = message?.member ?? interaction?.member;
        const voiceChannel = (member as any)?.voice?.channel;
        if (!voiceChannel) {
            const reply = "❌ Debes estar en un canal de voz para usar este comando.";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        try {
            await musicService.distube.stop(voiceChannel);
            const reply = `⏹️ Música detenida y bot desconectado.`;
            if (interaction) await interaction.reply({ content: reply });
            if (message) await message.reply(reply);
        } catch (e) {
            const reply = `❌ No se pudo detener la música: ${e}`;
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
        }
    }
}
