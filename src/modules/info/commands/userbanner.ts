/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType } from "zumito-framework";
import { config } from "../../../config/index.js";

export class UserBanner extends Command {

    categories = ['information'];
    examples: string[] = ['', '@Zumito']; 
    args: CommandArgDefinition[] = [{
        name: 'user',
        type: 'user',
        optional: true
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    async execute({ message, interaction, args, framework, guildSettings }: CommandParameters): Promise<void> {

        const user = args.get('user') || message?.author || interaction?.user;

        let banner = user.bannerURL({ format: 'png', size: 4096, force: true });

        if (!banner) {
            await user.fetch();
            banner = user.bannerURL({ format: 'png', size: 4096, force: true });
        }

        if (banner) {
            
            const embed = new EmbedBuilder()
                .setTitle(framework.translations.get('command.userbanner.title', guildSettings.lang, {
                    name: user.globalName || user.displayName
                }))
                .setImage(banner)
                .setColor(config.colors.default);
                
            const row: any = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(framework.translations.get('command.userbanner.button.browser', guildSettings.lang))
                        .setStyle(ButtonStyle.Link)
                        .setURL(banner)
                );
                    
            (message || interaction!)?.reply({
                embeds: [embed],
                components: [row],
                allowedMentions: {
                    repliedUser: false
                }
            });
        } else {
            if (!args.has('user')) {
                (message || interaction!)?.reply({
                    content: framework.translations.get('command.userbanner.no.banner', guildSettings.lang),
                    allowedMentions: { 
                        repliedUser: false 
                    }
                })
            } else {
                (message || interaction!)?.reply({
                    content: `${args.get('user').globalName || args.get('user').displayName} ${  framework.translations.get('command.userbanner.no.mention', guildSettings.lang)}`,
                    allowedMentions: { 
                        repliedUser: false 
                    }
                })
            }
        }
    }

}
