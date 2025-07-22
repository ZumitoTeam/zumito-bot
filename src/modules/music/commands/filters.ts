import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";
import { MessageFlags } from "zumito-framework/discord";

export class FiltersCommand extends Command {
    name = "filters";
    description = "Muestra o cambia los filtros de audio.";
    categories = ["music"];
    usage = "filters [filtro]";
    args = [
        { name: "filtro", type: "string", optional: true }
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
        const filtro = args.get("filtro");
        if (!queue) {
            const reply = "❌ No hay música en reproducción.";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        if (!filtro) {
            const reply = `🎚️ Filtros activos: ${queue.filters.names.join(", ") || "ninguno"}`;
            if (interaction) await interaction.reply({ content: reply });
            if (message) await message.reply(reply);
            return;
        }
        if (queue.filters.has(filtro)) queue.filters.remove(filtro);
        else queue.filters.add(filtro);
        const reply = `🎚️ Filtro ${filtro} ${queue.filters.has(filtro) ? "activado" : "desactivado"}`;
        if (interaction) await interaction.reply({ content: reply });
        if (message) await message.reply(reply);
    }
}
