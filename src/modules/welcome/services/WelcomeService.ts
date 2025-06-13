import { Client, TextBasedChannel } from 'zumito-framework/discord';
import { ServiceContainer, ZumitoFramework } from 'zumito-framework';

export class WelcomeService {
    private client: Client;
    private framework: ZumitoFramework;

    constructor() {
        this.client = ServiceContainer.getService(Client);
        this.framework = ServiceContainer.getService(ZumitoFramework);
        this.registerEvents();
    }

    private registerEvents() {
        this.client.on('guildMemberAdd', async (member) => {
            const WelcomeModel = this.framework.database.models.WelcomeConfig;
            if (!WelcomeModel) return;
            const config = await WelcomeModel.findOne({ where: { guildId: member.guild.id } }).catch(() => null);
            if (!config) return;
            const channel = member.guild.channels.cache.get(config.channelId) as TextBasedChannel | undefined;
            if (!channel || !('send' in channel)) return;
            let content = config.message || '';
            content = content.replace('{user}', `<@${member.id}>`).replace('{server}', member.guild.name);
            await (channel as any).send({ content });
        });
    }
}
