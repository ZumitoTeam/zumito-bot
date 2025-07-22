import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";
import { MessageFlags } from "discord.js";

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

        // Verifica si el bot está en un canal de voz usando la API de Discord
        const botMember = guild.members.me || await guild.members.fetchMe();
        const botVoiceChannel = botMember.voice?.channel;

        if (!botVoiceChannel) {
            const reply = "❌ No estoy en ningún canal de voz.";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }

        await musicService.distube.voices.leave(guild.id);
        if (botMember.voice?.channelId === botVoiceChannel.id) {
            await botMember.voice.disconnect();
        }
        const reply = `👋 Me he desconectado del canal de voz.`;
        if (interaction) await interaction.reply({ content: reply });
        if (message) await message.reply(reply);
    }
}
