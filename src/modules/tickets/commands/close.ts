import { Command, CommandParameters } from "zumito-framework";
import { MessageFlags, PermissionsBitField } from "zumito-framework/discord";
import { TicketService } from "../services/TicketService";

export class CloseTicket extends Command {
    name = "close-ticket";
    description = "Cierra el ticket actual";
    categories = ["tickets"];
    usage = "close-ticket";

    async execute({ message, interaction }: CommandParameters) {
        const channel = message?.channel || interaction?.channel;
        if (!channel || channel.type !== 0) return; // Solo canales de texto
        const ticketService = new TicketService();
        try {
            await ticketService.closeTicket(channel);
            // No respondemos porque el canal será eliminado
        } catch (e) {
            const reply = `Error al cerrar el ticket: ${e}`;
            if (interaction) {
                await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            } else if (message) {
                await message.reply(reply);
            }
        }
    }
}
