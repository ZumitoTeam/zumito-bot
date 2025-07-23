import { Client, EmbedBuilder, TextBasedChannel } from 'zumito-framework/discord';
import { GuildDataGetter, ServiceContainer, ZumitoFramework } from 'zumito-framework';

export class ConfessionService {

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private guildDataGetter: GuildDataGetter = ServiceContainer.getService(GuildDataGetter), 
    ) {}

    async sendConfession(guildId: string, text: string): Promise<boolean> {
        const guildSettings = await this.guildDataGetter.getGuildSettings(guildId);
        const channel = this.client.channels.cache.get(guildSettings.confessionsChannelId) as TextBasedChannel | undefined;
        if (!channel || !(channel as any).send) return false;
        const embed = new EmbedBuilder()
            .setTitle('Un usuario ha enviado una confesión')
            .setDescription("```"+text+"```");
        await (channel as any).send({ 
            embeds: [embed],
        });
        return true;
    }
}
