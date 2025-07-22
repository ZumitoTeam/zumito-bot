import { Command, CommandParameters } from "zumito-framework";
import { MessageFlags, PermissionsBitField } from "zumito-framework/discord";
import { TicketService } from "../services/TicketService";

export class TicketCommand extends Command {
    name = "ticket";
    description = "Abre un ticket de soporte";
    categories = ["tickets"];
    usage = "ticket";
    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const guild = message?.guild || interaction?.guild;
        const member = message?.member || interaction?.member;
        if (!guild || !member) return;
        // Aquí deberías obtener la categoría de tickets de la configuración de tu bot/guild
        // Por simplicidad, pedimos el ID de categoría como argumento temporalmente
        const categoryId = args.get("category_id") || null;
        if (!categoryId) {
            const reply = "Debes especificar el ID de la categoría de tickets. Ejemplo: /ticket <category_id>";
            if (interaction) { await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral }); return; }
            if (message) { await message.reply(reply); return; }
            return;
        }
        const ticketService = new TicketService();
        // Verificar si ya tiene un ticket abierto
        const openTicket = await ticketService.getOpenTicketByUser(guild.id, member.user.id);
        if (openTicket) {
            const reply = `Ya tienes un ticket abierto: <#${openTicket.channelId}>`;
            if (interaction) { await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral }); return; }
            if (message) { await message.reply(reply); return; }
            return;
        }
        try {
            const channel = await ticketService.createTicket(guild, member, categoryId);
            const reply = `Tu ticket ha sido creado: <#${channel.id}>`;
            if (interaction) { await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral }); return; }
            if (message) { await message.reply(reply); return; }
        } catch (e) {
            const reply = `Error al crear el ticket: ${e}`;
            if (interaction) { await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral }); return; }
            if (message) { await message.reply(reply); return; }
        }
    }
}
