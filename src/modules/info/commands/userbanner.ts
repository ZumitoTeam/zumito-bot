import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters  } from "zumito-framework";
import { EmbedBuilder } from "discord.js";
import { config } from "../../../config/index.js";
import { type } from "os";

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

    async execute({ message, interaction, args, client, framework, guildSettings, trans }: CommandParameters): Promise<void> {

        let user = args.get('user') || message?.author || interaction?.user;

        let banner = user.bannerURL({ format: 'png', size: 4096, force: true });
        let embed;
        if (!banner) {
            await user.fetch();
            banner = user.bannerURL({ format: 'png', size: 4096, force: true });
        }

        if (banner) {
            const embed = new EmbedBuilder()
                .setTitle(trans('title', {
                    name: user.tag
                }))
                .setDescription(trans('full') + '\n' + '[' + trans('click') + '](' + banner + ')')
                .setImage(banner)
                .setFooter({
                    text: trans('$global.requested', {
                        user: message?.author.tag || interaction?.user.tag
                    }),
                    iconURL: message?.author.displayAvatarURL({ forceStatic: false }) || interaction?.user.displayAvatarURL({ forceStatic: false })
                })
                .setColor(config.global.embeds.color);
            (message || interaction!)?.reply({
                embeds: [embed],
                allowedMentions: { 
                    repliedUser: false 
                }
            });
        } else {
            if (!args.has('user')) {
                (message || interaction!)?.reply({
                    content: trans('no.banner'),
                    allowedMentions: { 
                        repliedUser: false 
                    }
                })
            } else {
                (message || interaction!)?.reply({
                    content: `${args.get('user').tag} ` + trans('no.mention'),
                    allowedMentions: { 
                        repliedUser: false 
                    }
                })
            }
        }
    }


    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {

    }
}
