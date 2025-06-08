import { Command, CommandParameters } from "zumito-framework";
import { RankService } from "../services/RankService";
import { ServiceContainer } from "zumito-framework";

export class RankCommand extends Command {
    name = "rank";
    description = "Show your current XP and level.";
    categories = ["ranks"];
    examples = ["@usuario"];
    usage = "rank [user]";
    async execute({ message, interaction }: CommandParameters): Promise<void> {
        const guild = message?.guild || interaction?.guild;
        const user = message?.author || interaction?.user;
        if (!guild || !user) return;
        const rankService = ServiceContainer.getService(RankService) as RankService;
        const data = await rankService.getUser(guild.id, user.id).catch(() => null);
        if (!data) {
            const reply = `${user}, you have no XP yet! Start chatting to earn XP.`;
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
        const reply = `${user}, you are level ${data.level} with ${data.xp} XP.`;
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
