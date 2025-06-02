import { Command, CommandParameters } from "zumito-framework";
import { RankService } from "../services/RankService";
import { ServiceContainer } from "zumito-framework";
import { PermissionsBitField } from "zumito-framework/discord";

export class SetXpCommand extends Command {
    name = "setxp";
    description = "Set the XP of a user (admin only).";
    categories = ["ranks"];
    examples = ["setxp @usuario 1000", "setxp 1234567890 500"];
    usage = "setxp <user> <amount>";
    userPermissions: bigint[] = [PermissionsBitField.Flags.Administrator];
    args = [
        { name: "user", type: "user", optional: false },
        { name: "amount", type: "string", optional: false }
    ];
    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const guild = message?.guild || interaction?.guild;
        if (!guild) return;
        const user = args.get("user");
        const amount = args.get("amount");
        if (!user || isNaN(amount)) {
            const reply = `You must specify a user and an amount.`;
            if (message) {
                await message.reply(reply);
            } else if (interaction) {
                await interaction.reply(reply);
            }
            return;
        }
        const rankService = ServiceContainer.getService(RankService);
        const data = await rankService.setXp(guild.id, user.id, parseInt(amount)); 
        const reply = `<@${user.id}>'s XP is now set to ${data.xp} (level ${data.level}).`;
        if (message) {
            await message.reply(reply);
        } else if (interaction) {
            await interaction.reply(reply);
        }
    }
}
