import { Command, CommandParameters } from "zumito-framework";
import { RankService } from "../services/RankService";
import { ServiceContainer } from "zumito-framework";
import { PermissionsBitField } from "zumito-framework/discord";

export class AddXp extends Command {
    name = "addxp";
    description = "Add XP to a user (admin only).";
    userPermissions: bigint[] = [PermissionsBitField.Flags.Administrator];
    args = [
        { name: "user", type: "user", optional: false },
        { name: "amount", type: "string", optional: false }
    ];
    async execute({ message, interaction, args }: CommandParameters) {
        const guild = message?.guild || interaction?.guild;
        if (!guild) return;
        const user = args.get("user");
        const amount = args.get("amount");
        if (!user || isNaN(amount)) { 
            const reply = `You must specify a user and an amount. `;
            if (message) {
                await message.reply(reply);
            } else if (interaction) {
                await interaction.reply(reply);
            }
            return;
        }
        const rankService = ServiceContainer.getService(RankService) as RankService;
        const data = await rankService.addXp(guild.id, user.id, parseInt(amount)).catch((error: any) => { 
            console.error("Failed to add XP:", error);
            throw error;
        });
        const reply = `<@${user.id}> now has ${data.xp} XP and is level ${data.level}.`;
        if (message) {
            await message.reply(reply);
        } else if (interaction) {
            await interaction.reply(reply);
        }
    }
}
