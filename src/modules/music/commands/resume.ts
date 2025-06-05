import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";

export class ResumeCommand extends Command {
    name = "resume";
    description = "Reanuda la reproducción de música pausada.";
    categories = ["music"];
    usage = "resume";
    async execute({ message, interaction }: CommandParameters): Promise<void> {
        const guild = message?.guild ?? interaction?.guild;
        if (!guild) {
            const reply = "❌ No se pudo determinar el servidor (guild).";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        const musicService = ServiceContainer.getService(MusicService) as MusicService;
        const queue = musicService.distube.getQueue(guild.id);
        if (!queue) {
            const reply = "❌ No hay música en reproducción.";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        try {
            await musicService.distube.resume(guild.id);
            const reply = `▶️ Música reanudada.`;
            if (interaction) await interaction.reply({ content: reply });
            if (message) await message.reply(reply);
        } catch (e) {
            const reply = `❌ No se pudo reanudar la música: ${e}`;
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
        }
    }
}
