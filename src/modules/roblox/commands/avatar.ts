import { Command, CommandArgDefinition, CommandParameters, CommandType, ServiceContainer } from 'zumito-framework';
import { EmbedBuilder } from 'zumito-framework/discord';
import { config } from '../../../config/index.js';
import { RobloxService } from '../services/RobloxService.js';

export class RobloxAvatarCommand extends Command {
    name = 'rbxavatar';
    description = 'Shows the Roblox avatar of a user';
    categories = ['roblox'];
    args: CommandArgDefinition[] = [
        { name: 'username', type: 'string', optional: false },
    ];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'];
    type = CommandType.any;

    roblox: RobloxService;

    constructor() {
        super();
        this.roblox = ServiceContainer.getService(RobloxService) as RobloxService;
    }

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const username = args.get('username');
        if (!username) {
            (message || interaction)?.reply({ content: trans('error'), allowedMentions: { repliedUser: false } });
            return;
        }
        const userId = await this.roblox.getUserId(String(username));
        if (!userId) {
            (message || interaction)?.reply({ content: trans('notfound'), allowedMentions: { repliedUser: false } });
            return;
        }
        const avatarUrl = await this.roblox.getAvatarUrl(userId);
        if (!avatarUrl) {
            (message || interaction)?.reply({ content: trans('notfound'), allowedMentions: { repliedUser: false } });
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle(trans('title', { user: username }))
            .setImage(avatarUrl)
            .setColor(config.colors.default);

        (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
