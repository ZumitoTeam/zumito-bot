import { ServiceContainer, ZumitoFramework } from "zumito-framework";

export class EconomyService {
    private framework: ZumitoFramework;
    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
    }

    async getUser(userId: string): Promise<any> {
        return await this.framework.database.collection('economy_users').findOne({ userId });
    }

    async addGlobal(userId: string, which: "free" | "paid", amount: number) {
        let user = await this.getUser(userId);
        if (!user) {
            const newUser = { userId, free: 0, paid: 0, guilds: {} };
            await this.framework.database.collection('economy_users').insertOne(newUser);
            user = await this.getUser(userId);
        }
        const update: Partial<{ free: number; paid: number }> = {};
        if (which === "free") update.free = (user?.free || 0) + amount;
        if (which === "paid") update.paid = (user?.paid || 0) + amount;
        await this.framework.database.collection('economy_users').updateOne(
            { userId },
            { $set: update }
        );
        return await this.getUser(userId);
    }

    async substractGlobal(userId: string, which: "free" | "paid", amount: number) {
        let user = await this.getUser(userId);
        if (!user) {
            const newUser = { userId, free: 0, paid: 0, guilds: {} };
            await this.framework.database.collection('economy_users').insertOne(newUser);
            user = await this.getUser(userId);
        }
        const update: Partial<{ free: number; paid: number }> = {};
        if (which === "free") update.free = Math.max(0, (user?.free || 0) - amount);
        if (which === "paid") update.paid = Math.max(0, (user?.paid || 0) - amount);
        await this.framework.database.collection('economy_users').updateOne(
            { userId },
            { $set: update }
        );
        return await this.getUser(userId);
    }

    async getGuildBalance(userId: string, guildId: string) {
        const user = await this.getUser(userId);
        if (!user) return 0;
        return user.guilds?.[guildId]?.balance || 0;
    }

    async addGuildBalance(userId: string, guildId: string, amount: number) {
        const user = await this.getUser(userId);
        if (!user) {
            const newUser = { userId, free: 0, paid: 0, guilds: { [guildId]: { balance: amount } } };
            await this.framework.database.collection('economy_users').insertOne(newUser);
            return amount;
        }
        const currentBalance = user.guilds?.[guildId]?.balance || 0;
        const newBalance = currentBalance + amount;
        await this.framework.database.collection('economy_users').updateOne(
            { userId },
            { $set: { [`guilds.${guildId}.balance`]: newBalance } }
        );
        return newBalance;
    }

    async substractGuildBalance(userId: string, guildId: string, amount: number) {
        const user = await this.getUser(userId);
        if (!user) {
            const newUser = { userId, free: 0, paid: 0, guilds: { [guildId]: { balance: 0 } } };
            await this.framework.database.collection('economy_users').insertOne(newUser);
            return 0;
        }
        const currentBalance = user.guilds?.[guildId]?.balance || 0;
        const newBalance = Math.max(0, currentBalance - amount);
        await this.framework.database.collection('economy_users').updateOne(
            { userId },
            { $set: { [`guilds.${guildId}.balance`]: newBalance } }
        );
        return newBalance;
    }

    async setGlobal(userId: string, which: "free" | "paid", amount: number) {
        let user = await this.getUser(userId);
        if (!user) {
            const newUser = { userId, free: 0, paid: 0, guilds: {} };
            await this.framework.database.collection('economy_users').insertOne(newUser);
            user = await this.getUser(userId);
        }
        const update: Partial<{ free: number; paid: number }> = {};
        if (which === "free") update.free = Math.max(0, amount);
        if (which === "paid") update.paid = Math.max(0, amount);
        await this.framework.database.collection('economy_users').updateOne(
            { userId },
            { $set: update }
        );
        return await this.getUser(userId);
    }

    async setGuildCurrencyName(guildId: string, name: string): Promise<any> {
        const guild = await this.framework.database.collection('economy_guilds').findOne({ guildId });
        if (!guild) {
            const newGuild = { guildId, currencyName: name };
            await this.framework.database.collection('economy_guilds').insertOne(newGuild);
        } else {
            await this.framework.database.collection('economy_guilds').updateOne(
                { guildId },
                { $set: { currencyName: name } }
            );
        }
        return await this.framework.database.collection('economy_guilds').findOne({ guildId });
    }

    async getGuildCurrencyName(guildId: string) {
        const guild = await this.framework.database.collection('economy_guilds').findOne({ guildId });
        return guild?.currencyName || 'Coins';
    }
}
