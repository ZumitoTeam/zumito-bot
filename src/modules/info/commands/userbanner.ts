import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, User } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, EmojiFallback, ServiceContainer } from "zumito-framework";
import { config } from "../../../config/index.js";

export class UserBanner extends Command {

    categories = ['information'];
    examples: string[] = ['', '@zumito']; 
    args: CommandArgDefinition[] = [{
        name: 'user',
        type: 'user',
        optional: true
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES','USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    emojiFallback: EmojiFallback;

    constructor() {
        super();
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {

        const user = args.get('user') || message?.author || interaction?.user;

        if (user.id === (message?.author || interaction?.user)?.id) {
            const emoji = this.emojiFallback.getEmoji('', '😥');
            await (message || interaction!)?.reply({
                content: `${ emoji } ${trans('no.banner')}`,
                allowedMentions: { 
                    repliedUser: false 
                }
            });
            return;
        }

        const banner = await this.getUserBanner(user);
        if (banner) {

            const embed = new EmbedBuilder()
                .setTitle(trans('title', {
                    name: user.globalName || user.displayName
                }))
                .setImage(banner)
                .setColor(config.colors.default);
                
            const row: any = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(trans('button.browser'))
                        .setStyle(ButtonStyle.Link)
                        .setURL(banner),
                    
                );
                
            (message || interaction!)?.reply({
                embeds: [embed],
                components: [row],
                allowedMentions: {
                    repliedUser: false
                }
            });

        } else {

            const username = user ? user.globalName || user.displayName : '';
            const emoji = this.emojiFallback.getEmoji('', '😥');

            (message || interaction!)?.reply({
                content: `${emoji} ${trans('no.mention', { name: username })}`,
                allowedMentions: { 
                    repliedUser: false 
                }
            });
            
        }
    }

    async getUserBanner(user: User) {
        let banner = user.bannerURL({ extension: 'png', size: 4096, forceStatic: true });
        if (!banner) {
            await user.fetch();
            banner = user.bannerURL({ extension: 'png', size: 4096, forceStatic: true });
        }
        return banner;
    }

    selectMenu(): void {
    }
}
