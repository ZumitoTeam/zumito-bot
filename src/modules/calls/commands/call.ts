import { EmbedBuilder } from 'zumito-framework/discord';
import { Command, CommandParameters, CommandType, ServiceContainer } from 'zumito-framework';
import { CallService } from '../services/CallService.js';

export class CallCommand extends Command {
    name = 'call';
    description = 'Connect with another server.';
    categories = ['utils'];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES'];
    type = CommandType.any;

    async execute({ message, interaction, trans }: CommandParameters): Promise<void> {
        const guildId = (message || interaction)?.guild?.id;
        if (!guildId) return;
        const service = ServiceContainer.getService(CallService) as CallService;
        const result = await service.requestCall(guildId);
        const embed = new EmbedBuilder();
        if (result === 'notConfigured') {
            embed.setDescription(trans('notConfigured'));
        } else if (result === 'waiting') {
            embed.setDescription(trans('waiting'));
        } else {
            embed.setDescription(trans('connected'));
        }
        (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
