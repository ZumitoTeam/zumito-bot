import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";
import { MessageFlags } from "zumito-framework/discord";

export class RemoveCommand extends Command {
    name = "remove";
    description = "Elimina una canción de la cola por su posición.";
    categories = ["music"];
    usage = "remove <posición>";
    args = [
        { name: "posicion", type: "number", optional: false }
    ];
    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const musicService = ServiceContainer.getService(MusicService) as MusicService;
        const guild = message?.guild ?? interaction?.guild;
        if (!guild) {
            const reply = "❌ No se pudo determinar el servidor.";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        const queue = musicService.distube.getQueue(guild.id);
        const posicion = Number(args.get("posicion"));
        if (!queue || isNaN(posicion) || posicion < 1 || posicion >= queue.songs.length) {
            const reply = "❌ Posición inválida.";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        const removed = queue.songs.splice(posicion, 1)[0];
        const reply = `🗑️ Canción eliminada: **${removed.name}**`;
        if (interaction) await interaction.reply({ content: reply });
        if (message) await message.reply(reply);
    }
}
