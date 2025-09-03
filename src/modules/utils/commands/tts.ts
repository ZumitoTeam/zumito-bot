import { Command, CommandParameters } from "zumito-framework";
import { AttachmentBuilder, MessageFlags } from "discord.js";
function buildTTSUrl(text: string): string {
    const params = new URLSearchParams({
        ie: "UTF-8",
        client: "tw-ob",
        q: text,
        tl: "es",
        ttsspeed: "1"
    });
    return `https://translate.googleapis.com/translate_tts?${params.toString()}`;
}

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
            const url = buildTTSUrl(text);
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
