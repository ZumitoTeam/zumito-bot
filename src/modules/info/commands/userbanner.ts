import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters  } from "zumito-framework";
import { EmbedBuilder } from "discord.js";
import { config } from "../../../config.js";
import { type } from "os";

export class Userbanner extends Command {

    categories = ['information'];
    examples: string[] = ['', '<@878950861122985996>']; 
    args: CommandArgDefinition[] = [{
        name: 'user',
        type: 'user',
        optional: true
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    async execute({ message, interaction, args, client, framework, guildSettings, trans }: CommandParameters): Promise<void> {

        let user = args.get('user') || message?.author || interaction?.user;
        console.log(user);
        let banner = user.bannerURL({ format: 'png', size: 4096, force: true });
        let embed;
        if (!banner) {
            await user.fetch();
            banner = user.bannerURL({ format: 'png', size: 4096, force: true });
        }

        if (banner) {
            embed = new EmbedBuilder()
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
                .setColor(config.embeds.color);
        } else {
            embed = new EmbedBuilder()
                .setTitle('User does not have a banner')
        }


        (message || interaction!)?.reply({
            embeds:[embed],
            allowedMentions: { 
                repliedUser: false 
            }
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {

    }
}
