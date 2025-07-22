import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";
import { MessageFlags } from "zumito-framework/discord";

export class ForwardCommand extends Command {
    name = "forward";
    description = "Avanza X segundos en la canción actual.";
    categories = ["music"];
    usage = "forward <segundos>";
    args = [
        { name: "segundos", type: "number", optional: false }
    ];
    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const musicService = ServiceContainer.getService(MusicService) as MusicService;
        const guild = message?.guild ?? interaction?.guild;
        if (!guild) {
            const reply = "❌ No se pudo determinar el servidor (guild).";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        const queue = musicService.distube.getQueue(guild.id);
        const segundos = Number(args.get("segundos"));
        if (!queue || isNaN(segundos) || segundos <= 0) {
            const reply = "❌ Debes especificar los segundos a avanzar (> 0).";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        queue.seek(queue.currentTime + segundos);
        const reply = `⏩ Avanzado ${segundos} segundos.`;
        if (interaction) await interaction.reply({ content: reply });
        if (message) await message.reply(reply);
    }
}
