import { Client } from 'zumito-framework/discord';
import { ServiceContainer } from 'zumito-framework';
import { RankService } from './RankService';

export class RankMessageService {
    private client: Client;
    private rankService: RankService;

    constructor() {
        this.client = ServiceContainer.getService(Client);
        this.rankService = ServiceContainer.getService(RankService);
        this.registerEvents();
    }

    private registerEvents() {
        this.client.on('messageCreate', async (message) => {
            if (message.author.bot || !message.guild) return;
            await this.rankService.addXp(message.guild.id, message.author.id, 1);
        });
    }
}
