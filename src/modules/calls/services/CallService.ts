import { Client, TextChannel } from 'zumito-framework/discord';
import { GuildDataGetter, ServiceContainer } from 'zumito-framework';

interface ActiveCall {
    guildA: string;
    channelA: string;
    guildB: string;
    channelB: string;
}

export class CallService {
    private client: Client;
    private guildDataGetter: GuildDataGetter;
    private pendingGuild: string | null = null;
    private activeCalls: ActiveCall[] = [];

    constructor() {
        this.client = ServiceContainer.getService(Client);
        this.guildDataGetter = ServiceContainer.getService(GuildDataGetter);
        this.registerListener();
    }

    async requestCall(guildId: string): Promise<'waiting' | 'connected' | 'notConfigured'> {
        const settings = await this.guildDataGetter.getGuildSettings(guildId);
        if (!settings.callCategoryId) {
            return 'notConfigured';
        }

        if (this.pendingGuild && this.pendingGuild !== guildId) {
            const otherGuild = this.pendingGuild;
            this.pendingGuild = null;
            const result = await this.createChannels(guildId, otherGuild);
            this.activeCalls.push({
                guildA: guildId,
                channelA: result.channelA.id,
                guildB: otherGuild,
                channelB: result.channelB.id
            });
            this.activeCalls.push({
                guildA: otherGuild,
                channelA: result.channelB.id,
                guildB: guildId,
                channelB: result.channelA.id
            });
            return 'connected';
        }

        this.pendingGuild = guildId;
        return 'waiting';
    }

    private async createChannels(guildA: string, guildB: string): Promise<{ channelA: TextChannel; channelB: TextChannel; }> {
        const [settingsA, settingsB] = await Promise.all([
            this.guildDataGetter.getGuildSettings(guildA),
            this.guildDataGetter.getGuildSettings(guildB)
        ]);

        const gA = this.client.guilds.cache.get(guildA);
        const gB = this.client.guilds.cache.get(guildB);
        if (!gA || !gB) {
            throw new Error('Guild not found');
        }
        const catA = gA.channels.cache.get(settingsA.callCategoryId);
        const catB = gB.channels.cache.get(settingsB.callCategoryId);

        const channelA = await gA.channels.create({
            name: `call-${gB.name}`,
            type: 0,
            parent: catA ? catA.id : null
        });
        const channelB = await gB.channels.create({
            name: `call-${gA.name}`,
            type: 0,
            parent: catB ? catB.id : null
        });
        return { channelA, channelB };
    }

    private registerListener() {
        this.client.on('messageCreate', async (message) => {
            if (message.author.bot || !message.guild) return;
            const call = this.activeCalls.find(c => c.channelA === message.channel.id);
            if (!call) return;
            const target = this.client.channels.cache.get(call.channelB) as TextChannel | undefined;
            if (!target) return;
            await target.send(`[${message.author.username}]: ${message.content}`);
        });
    }
}
