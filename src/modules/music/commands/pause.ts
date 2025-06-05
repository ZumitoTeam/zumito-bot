import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";

export class PauseCommand extends Command {
    name = "pause";
    description = "Pausa la música actual.";
    categories = ["music"];
    usage = "pause";
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
            await musicService.distube.pause(guild.id);
            const reply = `⏸️ Música pausada.`;
            if (interaction) await interaction.reply({ content: reply });
            if (message) await message.reply(reply);
        } catch (e) {
            const reply = `❌ No se pudo pausar la música: ${e}`;
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
        }
    }
}
