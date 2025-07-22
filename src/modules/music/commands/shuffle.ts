import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { MusicService } from "../services/MusicService";
import { MessageFlags } from "zumito-framework/discord";

export class ShuffleCommand extends Command {
    name = "shuffle";
    description = "Mezcla la cola de canciones.";
    categories = ["music"];
    usage = "shuffle";
    async execute({ message, interaction }: CommandParameters): Promise<void> {
        const musicService = ServiceContainer.getService(MusicService) as MusicService;
        const guild = message?.guild ?? interaction?.guild;
        if (!guild) {
            const reply = "❌ No se pudo determinar el servidor.";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        const queue = musicService.distube.getQueue(guild.id);
        if (!queue) {
            const reply = "❌ No hay canciones en la cola.";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            if (message) await message.reply(reply);
            return;
        }
        queue.shuffle();
        const reply = `🔀 Cola mezclada.`;
        if (interaction) await interaction.reply({ content: reply });
        if (message) await message.reply(reply);
    }
}
