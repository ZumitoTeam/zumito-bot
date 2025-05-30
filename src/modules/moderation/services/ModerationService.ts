import { GuildDataGetter, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { Client } from "zumito-framework/discord";

type ModerationAction = 'ban' | 'kick' | 'warn';

export class ModerationService {
    // Placeholder for future moderation logic (mute, ban, kick, warn, etc.)
    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private guildDataGetter: GuildDataGetter = ServiceContainer.getService(GuildDataGetter)
    ) {}

    async ban(guild: any, userId: string, reason: string = "No reason provided.") {
        await guild.members.ban(userId, { reason });
    }

    async kick(guild: any, userId: string, reason: string = "No reason provided.") {
        const member = guild.members.cache.get(userId);
        if (!member) throw new Error("User not found in this server.");
        await member.kick(reason);
    }

    async warn(guildId: string, targetId: string, moderatorId: string, reason: string = "No reason provided.") {
        this.logModerationAction(guildId, targetId, moderatorId, 'warn', reason);
    }

    async getUserWarnings(guildId: string, targetId: string) {
        return this.framework.database.models.ModerationLog.all({
            where: {
                guildId: guildId,
                targetId: targetId,
                action: 'warn'
            },
            order: 'date DESC'
        }).catch((error: any) => {
            console.error("Failed to retrieve user warnings:", error);
            throw error;
        });
    }

    async getGuildWarnings(guildId: string) {
        return this.framework.database.models.ModerationLog.all({
            where: {
                guildId: guildId,
                action: 'warn'
            },
            order: 'date DESC'
        }).catch((error: any) => {
            console.error("Failed to retrieve guild warnings:", error);
            throw error;
        });
    }

    async getUserBans(guildId: string, targetId: string) {
        return this.framework.database.models.ModerationLog.all({
            where: {
                guildId: guildId,
                targetId: targetId,
                action: 'ban'
            },
            order: 'date DESC'
        }).catch((error: any) => {
            console.error("Failed to retrieve user bans:", error);
            throw error;
        });
    }

    async getGuildBans(guildId: string) {
        return this.framework.database.models.ModerationLog.all({
            where: {
                guildId: guildId,
                action: 'ban'
            },
            order: 'date DESC'
        }).catch((error: any) => {
            console.error("Failed to retrieve guild bans:", error);
            throw error;
        });
    }

    async getUserKicks(guildId: string, targetId: string) {
        return this.framework.database.models.ModerationLog.all({
            where: {
                guildId: guildId,
                targetId: targetId,
                action: 'kick'
            },
            order: 'date DESC'
        }).catch((error: any) => {
            console.error("Failed to retrieve user kicks:", error);
            throw error;
        });
    }

    async getGuildKicks(guildId: string) {
        return this.framework.database.models.ModerationLog.all({
            where: {
                guildId: guildId,
                action: 'kick'
            },
            order: 'date DESC'
        }).catch((error: any) => {
            console.error("Failed to retrieve guild kicks:", error);
            throw error;
        });
    }

    async logModerationAction(guildId: string, targetId: string, moderatorId: string, action: ModerationAction, reason: string = "No reason provided.") {
        await this.framework.database.models.ModerationLog.create({
            guildId: guildId,
            targetId: targetId,
            moderatorId: moderatorId,
            action: action,
            reason: reason,
            date: new Date()
        }).catch((error: any) => {
            console.error("Failed to log moderation action:", error);
            throw error;
        });
        this.guildDataGetter.getGuildSettings(guildId).then((settings: any) => {
            if (settings && settings.moderation_log_channel) {
                const guild = this.client.guilds.cache.get(guildId);
                if (!guild) throw new Error(`Guild with ID ${guildId} not found when logging moderation action.`);
                const channel = guild.channels.cache.get(settings.moderation_log_channel);
                if (channel && channel.isTextBased()) {
                    channel.send(`**Moderation Action:** ${action}\n**Target:** <@${targetId}>\n**Moderator:** <@${moderatorId}>\n**Reason:** ${reason}`);
                }
            }
        });
    }
}
