import { ServiceContainer, ZumitoFramework } from "zumito-framework";

export class RankService {
    private framework: ZumitoFramework;
    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
    }

    async addXp(guildId: string, userId: string, amount: number = 1) {
        const RankUser = this.framework.database.models.RankUser;
        let user = await RankUser.findOne({ where: { guildId, userId } });
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

    async getUser(guildId: string, userId: string) {
        return this.framework.database.models.RankUser.findOne({ where: { guildId, userId } });
    }

    async getLeaderboard(guildId: string, limit: number = 10) {
        return this.framework.database.models.RankUser.find({
            where: { guildId },
            order: [["xp", "DESC"]],
            limit
        });
    }
}
