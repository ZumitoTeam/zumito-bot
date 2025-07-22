import { Command, CommandParameters } from "zumito-framework";
import { AttachmentBuilder, MessageFlags } from "discord.js";
import googleTTS from "google-tts-api";

export class TTSCommand extends Command {
    name = "tts";
    description = "Reproduce texto usando Google TTS.";
    categories = ["utilities"];
    usage = "tts <texto>";
    args = [
        { name: "texto", type: "string", optional: false }
    ];

    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const text = args.get("texto");
        if (!text) {
            const reply = "Debes proporcionar un texto.";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        try {
            const url = googleTTS.getAudioUrl(text, {
                lang: "es",
                slow: false,
            });
            const res = await fetch(url);
            const buffer = Buffer.from(await res.arrayBuffer());
            const attachment = new AttachmentBuilder(buffer, { name: "tts.mp3" });
            if (interaction) await interaction.reply({ files: [attachment] });
            if (message) await message.reply({ files: [attachment] });
        } catch (e) {
            const reply = `❌ Error generando audio: ${e}`;
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
        }
    }
}
