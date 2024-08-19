import { EmbedBuilder, GuildMember, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters } from "zumito-framework";
import { config } from "../../../config/index.js";

export class Avatar extends Command {

    categories = ['information'];
    examples: string[] = ['', "@zumito"]; 
    args: CommandArgDefinition[] = [{
        name: "user",
        type: "member",
        optional: true,
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'];
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

            .setTitle(trans('title', {
                user: member.user.globalName || member.user.displayName
            }))
           
            .setImage(member.user.displayAvatarURL({ 
                forceStatic: false, 
                size: 4096 
            }))

            .setFooter({
                text: trans('$global.requested', {
                    user: message?.author.globalName || interaction?.user.globalName
                }),
                iconURL: message?.author.displayAvatarURL({ forceStatic: false }) || interaction?.user.displayAvatarURL({ forceStatic: false })
            })

            .setColor(config.colors.default);

            const row: any = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel(trans('button.browser'))
                .setStyle(ButtonStyle.Link)
                .setURL(`${member.user.displayAvatarURL({forceStatic: false, size: 4096 })}`)
            );

        (message||interaction!)?.reply({ 
            embeds: [embed], 
            components: [row],
            allowedMentions: { 
                repliedUser: false 
            } 
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {}

}