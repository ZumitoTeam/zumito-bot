import { Command, CommandArgDefinition, CommandParameters, CommandType, ServiceContainer } from 'zumito-framework';
import { EmbedBuilder } from 'zumito-framework/discord';
import { config } from '../../../config/index.js';
import { RobloxService } from '../services/RobloxService.js';

export class RobloxProfileCommand extends Command {
    name = 'rbxprofile';
    description = 'Displays a Roblox user profile';
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
        const info = await this.roblox.getUserInfo(String(username));
        if (!info) {
            (message || interaction)?.reply({ content: trans('notfound'), allowedMentions: { repliedUser: false } });
            return;
        }
        const avatarUrl = await this.roblox.getAvatarUrl(info.id);
        const embed = new EmbedBuilder()
            .setTitle(trans('title', { user: info.displayName || info.name }))
            .setThumbnail(avatarUrl)
            .addFields(
                { name: trans('id'), value: `${info.id}`, inline: true },
                { name: trans('created'), value: `<t:${Math.floor(new Date(info.created).getTime() / 1000)}:R>`, inline: true },
                { name: trans('about'), value: info.description || trans('none') },
            )
            .setColor(config.colors.default);

        (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
