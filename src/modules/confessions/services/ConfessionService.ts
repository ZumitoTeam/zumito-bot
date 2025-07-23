import { Client, TextBasedChannel } from 'zumito-framework/discord';
import { ServiceContainer, ZumitoFramework } from 'zumito-framework';

export class ConfessionService {
    private client: Client;
    private framework: ZumitoFramework;

    constructor() {
        this.client = ServiceContainer.getService(Client);
        this.framework = ServiceContainer.getService(ZumitoFramework);
    }

    async sendConfession(guildId: string, text: string): Promise<boolean> {
        const model = this.framework.database.models.ConfessionConfig;
        if (!model) return false;
        const config = await model.findOne({ where: { guildId } }).catch(() => null);
        if (!config) return false;
        const channel = this.client.channels.cache.get(config.channelId) as TextBasedChannel | undefined;
        if (!channel || !(channel as any).send) return false;
        await (channel as any).send({ content: text });
        return true;
    }
}
