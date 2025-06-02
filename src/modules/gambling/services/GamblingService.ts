import { ServiceContainer } from "zumito-framework";
import { EconomyService } from "../../economy/services/EconomyService";

export class GamblingService {
    private economy: EconomyService;
    constructor() {
        this.economy = ServiceContainer.getService(EconomyService);
    }

    async coinflip(userId: string, guildId: string, amount: number): Promise<{ result: "win" | "lose", newBalance: number }> {
        const win = Math.random() < 0.5;
        if (win) {
            await this.economy.addGuildBalance(userId, guildId, amount);
        } else {
            await this.economy.substractGuildBalance(userId, guildId, amount);
        }
        const newBalance = await this.economy.getGuildBalance(userId, guildId);
        return { result: win ? "win" : "lose", newBalance };
    }

    async slots(userId: string, guildId: string, amount: number): Promise<{ result: "win" | "lose", newBalance: number, slots: string[] }> {
        const symbols = ["🍒", "🍋", "🍉", "🍇", "⭐", "7️⃣"];
        const slots = [0, 0, 0].map(() => symbols[Math.floor(Math.random() * symbols.length)]);
        let win = false;
        if (slots[0] === slots[1] && slots[1] === slots[2]) win = true;
        if (win) {
            await this.economy.addGuildBalance(userId, guildId, amount * 5);
        } else {
            await this.economy.substractGuildBalance(userId, guildId, amount);
        }
        const newBalance = await this.economy.getGuildBalance(userId, guildId);
        return { result: win ? "win" : "lose", newBalance, slots };
    }
}
