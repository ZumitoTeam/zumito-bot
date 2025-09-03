import { Client, PermissionFlagsBits, TextChannel } from "zumito-framework/discord";
import { ServiceContainer, ZumitoFramework } from "zumito-framework";
import { BirthdayEmbedBuilder } from "./embedBuilder/BirthdayEmbedBuilder";

interface BirthdayDoc {
    userId: string;
    month: number; // 1-12
    day: number;   // 1-31
    year?: number | null; // optional
    lastNotifiedYear?: number | null; // to avoid duplicate notifications per year
}

export class BirthdayService {
    private framework: ZumitoFramework;
    private client: Client;
    private running = false;
    private timer: NodeJS.Timeout | null = null;

    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
        this.client = ServiceContainer.getService(Client);
    }

    collection() {
        return this.framework.database.collection('birthdays');
    }

    async setUserBirthday(userId: string, month: number, day: number, year?: number | null): Promise<void> {
        const payload: Partial<BirthdayDoc> = { month, day };
        if (typeof year !== 'undefined') payload.year = year;
        await this.collection().updateOne(
            { userId },
            { $set: payload, $setOnInsert: { lastNotifiedYear: null, userId } },
            { upsert: true }
        );
    }

    async getUserBirthday(userId: string): Promise<BirthdayDoc | null> {
        return (await this.collection().findOne({ userId })) as BirthdayDoc | null;
    }

    async setGuildChannel(guildId: string, channelId: string): Promise<void> {
        await this.framework.database.collection('guilds').updateOne(
            { guild_id: guildId },
            { $set: { birthdayChannelId: channelId } },
            { upsert: true }
        );
    }

    async getGuildChannel(guildId: string): Promise<string | null> {
        const guildDoc = await this.framework.database.collection('guilds').findOne({ guild_id: guildId });
        return (guildDoc && (guildDoc as any).birthdayChannelId) || null;
    }

    startScheduler(): void {
        if (this.running) return;
        this.running = true;
        // Check every hour to be safe; send once per user per year using lastNotifiedYear guard.
        this.timer = setInterval(() => {
            this.checkAndNotify().catch(() => undefined);
        }, 60 * 60 * 1000);
        // Initial delayed run to avoid sending at startup spikes
        setTimeout(() => this.checkAndNotify().catch(() => undefined), 15 * 1000);
    }

    stopScheduler(): void {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
        this.running = false;
    }

    private todayParts(): { month: number; day: number; year: number } {
        const now = new Date();
        return { month: now.getUTCMonth() + 1, day: now.getUTCDate(), year: now.getUTCFullYear() };
    }

    private async checkAndNotify(): Promise<void> {
        const { month, day, year } = this.todayParts();
        const cursor = this.collection().find({ month, day, $or: [ { lastNotifiedYear: { $ne: year } }, { lastNotifiedYear: null }, { lastNotifiedYear: { $exists: false } } ] });
        const users = await cursor.toArray() as BirthdayDoc[];
        if (!users.length) return;

        for (const u of users) {
            await this.notifyUserBirthday(u, year);
        }
    }

    private async notifyUserBirthday(entry: BirthdayDoc, year: number): Promise<void> {
        const userId = entry.userId;
        const embedBuilder = new BirthdayEmbedBuilder();

        // Iterate over guilds and post in configured channels where the user is a member
        const guilds = this.client.guilds.cache;
        let sentSomewhere = false;
        for (const [, guild] of guilds) {
            const guildDoc = await this.framework.database.collection('guilds').findOne({ guild_id: guild.id }).catch(() => null) as any;
            const channelId = guildDoc?.birthdayChannelId || null;
            if (!channelId) continue;
            const channel = guild.channels.cache.get(channelId) as TextChannel | undefined;
            if (!channel || !channel.isTextBased()) continue;

            // Ensure bot can send messages
            const me = guild.members.me;
            if (!me) continue;
            const perms = channel.permissionsFor(me);
            if (!perms || !perms.has(PermissionFlagsBits.SendMessages)) continue;

            // Ensure the target user is in the guild
            const member = guild.members.cache.get(userId) || await guild.members.fetch(userId).catch(() => null);
            if (!member) continue;

            const lang = (guildDoc && guildDoc.lang) || 'en';
            const embed = embedBuilder.buildGuildBirthdayEmbed(this.framework, guild, member.user, entry, lang);
            try {
                await channel.send({ content: `<@${userId}>`, embeds: [embed] });
                sentSomewhere = true;
            } catch {
                // ignore individual guild failures
            }
        }

        if (sentSomewhere) {
            await this.collection().updateOne({ userId }, { $set: { lastNotifiedYear: year } });
        }
    }
}
