import { Command, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { EconomyService } from "../services/EconomyService";

export class AddMoneyCommand extends Command {
    name = "addmoney";
    description = "Agrega dinero a un usuario (solo admins)";
    categories = ["economy", "admin"];
    usage = "addmoney <@usuario> <cantidad>";
    args = [
        { name: "usuario", type: "user", optional: false },
        { name: "cantidad", type: "string", optional: false }
    ];

    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const member = interaction?.member ?? message?.member;
        const isAdmin = (
            member &&
            "permissions" in member &&
            typeof member.permissions !== "string" &&
            member.permissions?.has?.("Administrator")
        ) || false;
        if (!isAdmin) {
            const reply = "❌ Solo administradores pueden usar este comando.";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            else if (message) await message.reply(reply);
            return;
        }

        const user = args.get("usuario");
        const cantidad = Number(args.get("cantidad"));
        if (!user || isNaN(cantidad) || cantidad <= 0) {
            const reply = "Debes mencionar un usuario y una cantidad válida. Ejemplo: /addmoney @usuario 100";
            if (interaction) {
                await interaction.reply({ content: reply, ephemeral: true });
                return;
            }
            if (message) {
                await message.reply(reply);
                return;
            }
            return;
        }

        const economy = ServiceContainer.getService(EconomyService);
        const guild = interaction?.guild ?? message?.guild;
        if (!guild) {
            const reply = "No se pudo determinar el servidor (guild).";
            if (interaction) await interaction.reply({ content: reply, ephemeral: true });
            else if (message) await message.reply(reply);
            return;
        }
        await economy.addGuildBalance(user.id, guild.id, cantidad);

        const reply = `💸 Se han añadido **${cantidad}** monedas a <@${user.id}>.`;
        if (interaction) await interaction.reply(reply);
        else if (message) await message.reply(reply);
    }
}
