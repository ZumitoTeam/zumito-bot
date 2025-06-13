import { Command, CommandParameters, ServiceContainer } from 'zumito-framework';
import { ReputationService } from '../services/ReputationService.js';

export class ReputationCommand extends Command {
    name = 'reputation';
    description = 'Show a user\'s reputation';
    categories = ['reputation'];
    examples = ['@user'];
    args = [{ name: 'user', type: 'user', optional: true }];

    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const user = args.get('user') || message?.mentions?.users?.first() || message?.author || interaction?.user;
        if (!user) return;
        const service = ServiceContainer.getService(ReputationService) as ReputationService;
        const rep = await service.getReputation(user.id);
        const reply = `${user.globalName || user.username} has ${rep} reputation points.`;
        if (message) {
            await message.reply(reply);
        } else if (interaction) {
            await interaction.reply(reply);
        }
    }
}
