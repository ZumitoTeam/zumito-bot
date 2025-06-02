import { Command, CommandParameters } from "zumito-framework";
import { GamblingService } from "../services/GamblingService";
import { ServiceContainer } from "zumito-framework";

export class SlotsCommand extends Command {
    name = "slots";
    description = "Bet an amount and spin the slots!";
    categories = ["gambling"];
    examples = ["slots 100", "slots 25"];
    usage = "slots <amount>";
    args = [
        { name: "amount", type: "integer", optional: false }
    ];
    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const guild = message?.guild || interaction?.guild;
        const user = message?.author || interaction?.user;
        if (!guild || !user) return;
        const amount = args.get("amount");
        if (typeof amount !== "number" || amount <= 0) {
            const reply = `You must bet a positive amount.`;
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
        const gambling = ServiceContainer.getService(GamblingService) as GamblingService;
        const { result, newBalance, slots } = await gambling.slots(user.id, guild.id, amount);
        let reply = `🎰 [${slots.join(" | ")}]\nYou ${result === "win" ? `won ${amount * 5}` : `lost ${amount}`}!\n`;
        reply += `Your new balance: ${newBalance}`;
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
