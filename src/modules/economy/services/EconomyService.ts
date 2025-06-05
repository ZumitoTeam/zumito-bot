import { ServiceContainer, ZumitoFramework } from "zumito-framework";

export class EconomyService {
    private framework: ZumitoFramework;
    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
    }

    async getUser(userId: string) {
        return await this.framework.database.models.EconomyUser.findOne({ where: { userId } });
    }

    async addGlobal(userId: string, which: "free" | "paid", amount: number) {
        const EconomyUser = this.framework.database.models.EconomyUser;
        let user = await this.getUser(userId);
        if (!user) user = await EconomyUser.create({ userId, free: 0, paid: 0, guilds: {} });
        if (which === "free") user.free += amount;
        if (which === "paid") user.paid += amount;
        await user.save();
        return user;
    }

    async substractGlobal(userId: string, which: "free" | "paid", amount: number) {
        const EconomyUser = this.framework.database.models.EconomyUser;
        let user = await this.getUser(userId);
        if (!user) user = await EconomyUser.create({ userId, free: 0, paid: 0, guilds: {} });
        if (which === "free") user.free = Math.max(0, user.free - amount);
        if (which === "paid") user.paid = Math.max(0, user.paid - amount);
        await user.save();
        return user;
    }

    async getGuildBalance(userId: string, guildId: string) {
        let user = await this.getUser(userId);
        if (!user) return 0;
        return user.guilds?.[guildId]?.balance || 0;
    }

    async addGuildBalance(userId: string, guildId: string, amount: number) {
        const EconomyUser = this.framework.database.models.EconomyUser;
        let user = await this.getUser(userId).catch(() => null);
        if (!user) user = await EconomyUser.create({ userId, free: 0, paid: 0, guilds: {} });
        if (!user.guilds[guildId]) user.guilds[guildId] = { balance: 0 };
        user.guilds[guildId].balance += amount;
        await user.save();
        return user.guilds[guildId].balance;
    }

    async substractGuildBalance(userId: string, guildId: string, amount: number) {
        const EconomyUser = this.framework.database.models.EconomyUser;
        let user = await this.getUser(userId);
        if (!user) user = await EconomyUser.create({ userId, free: 0, paid: 0, guilds: {} });
        if (!user.guilds[guildId]) user.guilds[guildId] = { balance: 0 };
        user.guilds[guildId].balance = Math.max(0, user.guilds[guildId].balance - amount);
        await user.save();
        return user.guilds[guildId].balance;
    }

    async setGuildCurrencyName(guildId: string, name: string) {
        const EconomyGuild = this.framework.database.models.EconomyGuild;
        let guild = await EconomyGuild.findOne({ where: { guildId } });
        if (!guild) guild = await EconomyGuild.create({ guildId, currencyName: name });
        else guild.currencyName = name;
        await guild.save();
        return guild;
    }

    async getGuildCurrencyName(guildId: string) {
        const EconomyGuild = this.framework.database.models.EconomyGuild;
        let guild = await EconomyGuild.findOne({ where: { guildId } });
        return guild?.currencyName || 'Coins';
    }
}
