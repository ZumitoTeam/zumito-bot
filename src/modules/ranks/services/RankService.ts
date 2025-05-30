import { ServiceContainer, ZumitoFramework } from "zumito-framework";

export class RankService {
    private framework: ZumitoFramework;
    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
    }

    async addXp(guildId: string, userId: string, amount: number = 1) {
        const RankUser = this.framework.database.models.RankUser;
        let user = await this.getUser(guildId, userId);
        if (!user) {
            user = await RankUser.create({ guildId, userId, xp: 0, level: 1 });
        }
        user.xp += amount;
        user.lastMessage = new Date();
        // Level up logic: simple formula (e.g., 100xp per level)
        const nextLevelXp = user.level * 100;
        if (user.xp >= nextLevelXp) {
            user.level += 1;
            // Optionally: user.xp = user.xp - nextLevelXp;
        }
        await user.save();
        return user;
    }

    async setXp(guildId: string, userId: string, amount: number) {
        const RankUser = this.framework.database.models.RankUser;
        let user = await this.getUser(guildId, userId);
        if (!user) {
            user = await RankUser.create({ guildId, userId, xp: 0, level: 1 });
        }
        user.xp = amount;
        // Recalculate level based on new XP
        user.level = Math.floor(user.xp / 100) + 1; // Assuming 100xp per level
        user.lastMessage = new Date();
        await user.save();
        return user;
    }

    async getUser(guildId: string, userId: string) {
        return await this.framework.database.models.RankUser.findOne({ where: { guildId, userId } });
    }

    async getLeaderboard(guildId: string, limit: number = 10) {
        return await this.framework.database.models.RankUser.find({
            where: { guildId },
            order: ["xp", "DESC"],
            limit
        });
    }
}
