import { Command, CommandParameters } from "zumito-framework";
import { PermissionsBitField } from "zumito-framework/discord";
import { EconomyService } from "../services/EconomyService";
import { ServiceContainer } from "zumito-framework";

export class BalanceCommand extends Command {
    name = "balance";
    description = "Check your balance. Admins can check another user's guild balance.";
    categories = ["economy"];
    examples = ["balance", "balance @usuario"];
    usage = "balance [user]";
    userPermissions: bigint[] = [];
    args = [
        { name: "user", type: "user", optional: true }
    ];
    async execute({ message, interaction, args }: CommandParameters) {
        const guild = message?.guild || interaction?.guild;
        if (!guild) return;
        const economyService = ServiceContainer.getService(EconomyService) as EconomyService;
        const author = message?.member || interaction?.member;
        const isAdmin = author?.permissions instanceof PermissionsBitField
            ? (author.permissions as PermissionsBitField).has(PermissionsBitField.Flags.Administrator)
            : false;
        let target = args.get("user") || (isAdmin ? message?.mentions?.users?.first() : null);
        if (!target) target = message?.author || interaction?.user;
        if (!target) return;
        // Always show global balances
        const userData = await economyService.getUser(target.id).catch(() => null);
        const free = userData?.free || 0;
        const paid = userData?.paid || 0;
        // Guild balance
        const guildBalance = await economyService.getGuildBalance(target.id, guild.id).catch(() => 0);
        const currencyName = await economyService.getGuildCurrencyName(guild.id).catch(() => "Guild Coins");
        let reply = `💰 Balance for <@${target.id}>\n`;
        reply += `• Free: ${free}\n`;
        reply += `• Paid: ${paid}\n`;
        reply += `• ${currencyName}: ${guildBalance}`;
        if (message) {
            await message.reply(reply);
            return;
        }
        if (interaction) {
            await interaction.reply(reply);
            return;
        }
    }
}
