import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";

export class LeaveCommand extends Command {
    name = "leave";
    description = "Haz que el bot salga del canal de voz.";
    categories = ["music"];
    usage = "leave";
    async execute({ message, interaction }: CommandParameters): Promise<void> {
        const musicService = ServiceContainer.getService(MusicService) as MusicService;
        const guild = message?.guild ?? interaction?.guild;
        if (!guild) {
            const reply = "❌ No se pudo determinar el servidor (guild).";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        const queue = musicService.distube.getQueue(guild.id);
        if (!queue) {
            const reply = "❌ No estoy en ningún canal de voz.";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            if (message) await message.reply(reply);
            return;
        }
        await musicService.distube.voices.leave(guild.id);
        const reply = `👋 Me he desconectado del canal de voz.`;
        if (interaction) await interaction.reply({ content: reply });
        if (message) await message.reply(reply);
    }
}
