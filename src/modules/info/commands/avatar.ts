import { EmbedBuilder, GuildMember } from "discord.js";
import { config } from "../../../config.js";
import { Command, CommandArgDefinition, CommandParameters,  CommandType  } from "zumito-framework";
import { SelectMenuParameters } from "zumito-framework/dist/types/SelectMenuParameters";
import { type } from "os";

export class Avatar extends Command {

    categories = ['information'];
    examples: string[] = ['', '@zumito']; 
    args: CommandArgDefinition[] = [{
        name: "user",
        type: "member",
        optional: true,
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;
    

    execute({ message, interaction, args, client, framework, guildSettings, trans }: CommandParameters): void {
        let member: GuildMember = args.get('user') || (message||interaction!).member;
        if (!member) {
            (message||interaction!)?.reply({
                content: trans('error'), 
                allowedMentions: { 
                    repliedUser: false 
                }
            });
            return;
        }
        let embed = new EmbedBuilder()
            .setTitle( trans('title', {
                user: member.user.tag
            }))
            .setDescription(`[Avatar URL](${member.user.displayAvatarURL({forceStatic: false, size: 4096 })})`)
            .setImage(member.user.displayAvatarURL({ 
                forceStatic: false, 
                size: 4096 
            }))
            .setFooter({
                text:  trans('$global.requested', {
                    user: message?.author.tag || interaction?.user.tag
                }),
                iconURL: message?.author.displayAvatarURL({ forceStatic: false }) || interaction?.user.displayAvatarURL({ forceStatic: false })
            })
            .setTimestamp(new Date())
            .setColor(config.embeds.color);

        (message||interaction!)?.reply({ 
            embeds: [embed], 
            allowedMentions: { 
                repliedUser: false 
            } 
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {}

}