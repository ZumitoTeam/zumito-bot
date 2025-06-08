import { Command, CommandParameters } from "zumito-framework";
import { RankService } from "../services/RankService";
import { ServiceContainer } from "zumito-framework";

export class Leaderboard extends Command {
    name = "leaderboard";
    description = "Show the top users by XP in this server.";
    categories = ["ranks"];
    examples = [""];
    usage = "leaderboard";
    async execute({ message, interaction }: CommandParameters): Promise<void> {
        const guild = message?.guild || interaction?.guild;
        if (!guild) return;
        const rankService = ServiceContainer.getService(RankService) as RankService;
        const top = await rankService.getLeaderboard(guild.id, 10);
        if (!top || top.length === 0) {
            const reply = `No users with XP yet!`;
            if (message) {
                await message.reply(reply);
                return;
            }
            if (interaction) {
                await interaction.reply(reply);
                return;
            }
            return;
        }
        let reply = `🏆 **Leaderboard** 🏆\n`;
        top.forEach((user: any, i: number) => {
            reply += `#${i + 1} <@${user.userId}> - Level ${user.level} (${user.xp} XP)\n`;
        });
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
