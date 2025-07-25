import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";
import { joinVoiceChannel } from "@discordjs/voice";
import { MessageFlags } from "zumito-framework/discord";

export class JoinCommand extends Command {
    name = "join";
    description = "Haz que el bot se una a tu canal de voz.";
    categories = ["music"];
    usage = "join";
    async execute({ message, interaction }: CommandParameters): Promise<void> {
        const member = message?.member ?? interaction?.member;
        const voiceChannel = (member as any)?.voice?.channel;
        if (!voiceChannel) {
            const reply = "❌ Debes estar en un canal de voz para usar este comando.";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        try {
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: voiceChannel.guild.id,
                adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                selfDeaf: false
            });
            const reply = `✅ Me he unido a tu canal de voz.`;
            if (interaction) await interaction.reply({ content: reply });
            if (message) await message.reply(reply);
        } catch (e) {
            const reply = `❌ No se pudo unir: ${e}`;
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
        }
    }
}
