import { ServiceContainer, ZumitoFramework } from 'zumito-framework';
import { Client, ApplicationCommandType, Interaction } from 'zumito-framework/discord';

export class ReputationService {
    private client: Client;
    private framework: ZumitoFramework;

    constructor() {
        this.client = ServiceContainer.getService(Client);
        this.framework = ServiceContainer.getService(ZumitoFramework);
        this.registerListeners();
    }

    private registerListeners() {
        this.client.on('ready', async () => {
            await this.registerCommands();
        });

        this.client.on('interactionCreate', async (interaction: Interaction) => {
            if (!interaction.isUserContextMenuCommand()) return;
            const target = interaction.targetUser;
            if (!target) return;

            if (interaction.commandName === 'Upvote') {
                await this.addReputation(target.id, 1);
                await interaction.reply({ content: `Gave +1 reputation to ${target}.`, ephemeral: true });
            } else if (interaction.commandName === 'Downvote') {
                await this.addReputation(target.id, -1);
                await interaction.reply({ content: `Gave -1 reputation to ${target}.`, ephemeral: true });
            }
        });
    }

    private async registerCommands() {
        if (!this.client.application) return;
        const existing = await this.client.application.commands.fetch();
        if (!existing.some(c => c.name === 'Upvote' && c.type === ApplicationCommandType.User)) {
            await this.client.application.commands.create({ name: 'Upvote', type: ApplicationCommandType.User });
        }
        if (!existing.some(c => c.name === 'Downvote' && c.type === ApplicationCommandType.User)) {
            await this.client.application.commands.create({ name: 'Downvote', type: ApplicationCommandType.User });
        }
    }

    async addReputation(userId: string, amount: number) {
        const Model = this.framework.database.models.ReputationUser;
        let record = await Model.findOne({ where: { userId } });
        if (!record) {
            record = await Model.create({ userId, reputation: 0 });
        }
        record.reputation += amount;
        await record.save();
        return record.reputation;
    }

    async getReputation(userId: string) {
        const Model = this.framework.database.models.ReputationUser;
        const record = await Model.findOne({ where: { userId } });
        return record ? record.reputation : 0;
    }
}
