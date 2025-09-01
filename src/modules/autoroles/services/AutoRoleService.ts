import { Client } from "zumito-framework/discord";
import { ServiceContainer, ZumitoFramework } from "zumito-framework";

interface AutoRoleData {
    guildId: string;
    channelId: string;
    messageId: string;
    emoji: string;
    roleId: string;
}

export class AutoRoleService {
    private client: Client;
    private framework: ZumitoFramework;
    private db: any;

    constructor() {
        this.client = ServiceContainer.getService(Client);
        this.framework = ServiceContainer.getService(ZumitoFramework);
        this.db = this.framework.database;
        this.registerEvents();
    }

    private registerEvents(): void {
        this.client.on("messageReactionAdd", async (reaction, user) => {
            if (user.bot) return;
            const emoji = reaction.emoji.id || reaction.emoji.name;
            const data = await this.getAutoRole(reaction.message.id, emoji);
            if (!data) return;
            const guild = reaction.message.guild;
            const member = guild?.members.cache.get(user.id);
            const role = guild?.roles.cache.get(data.roleId);
            if (!member || !role) return;
            await member.roles.add(role).catch(() => null);
        });
        this.client.on("messageReactionRemove", async (reaction, user) => {
            if (user.bot) return;
            const emoji = reaction.emoji.id || reaction.emoji.name;
            const data = await this.getAutoRole(reaction.message.id, emoji);
            if (!data) return;
            const guild = reaction.message.guild;
            const member = guild?.members.cache.get(user.id);
            const role = guild?.roles.cache.get(data.roleId);
            if (!member || !role) return;
            await member.roles.remove(role).catch(() => null);
        });
    }

    async addAutoRole(data: AutoRoleData): Promise<void> {
        await this.db.collection("autoroles").insertOne(data);
    }

    async getAutoRole(messageId: string, emoji: string): Promise<AutoRoleData | null> {
        return await this.db.collection("autoroles").findOne({ messageId, emoji });
    }
}
