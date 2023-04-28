import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters, TextFormatter } from "zumito-framework";
import { config } from "../../../config/index.js";
import { EmbedBuilder } from "zumito-framework/discord";

export class UserInfo extends Command {

    categories = ['information'];
    examples: string[] = ['', '@Zumito']; 
    args: CommandArgDefinition[] = [{
        name: 'user',
        type: 'user',
        optional: true
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;
    
    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {

        let user = args.get('user') || (message||(interaction!)).member!.user;
        let member: any = (message||(interaction!)).guild?.members.cache.get(user.id);

        let userCreateDate = user.createdAt;
        let userGuildJoinDate = member.joinedAt as Date;

        let userRoles: any = member.roles.cache;
        if (userRoles.size > 10) {
            userRoles = framework.translations.get('command.userinfo.roles', guildSettings.language, {
                roles: userRoles.size
            });
        } else if (userRoles <= 1) { // If the user has no roles or only @everyone
            userRoles = framework.translations.get('command.userinfo.noRoles', guildSettings.language);
        } else {
            // Get the roles without @everyone
            userRoles = userRoles.filter((r: any) => r.id !== (message||(interaction!)).guild?.id)
                .map((r: any) => r)
                .join(' • ');
        }

        let statusGame = member?.presence?.activities[0];

        let description = [
            framework.translations.get('command.userinfo.user', guildSettings.lang, {
                name: user.tag, 
            }),
            framework.translations.get('command.userinfo.nickname', guildSettings.lang, {
                nick: (member.nickname || framework.translations.get('command.userinfo.noNickname', guildSettings.lang))
            }),
            framework.translations.get('command.userinfo.id', guildSettings.lang, {
                id: user.id
            }),
            framework.translations.get('command.userinfo.playing', guildSettings.lang, {
                playing: statusGame || framework.translations.get('command.userinfo.noPlaying', guildSettings.lang)
            })
        ];

        const embed = new EmbedBuilder()
            .setTitle(framework.translations.get('command.userinfo.title', guildSettings.lang))
            .setThumbnail(member.displayAvatarURL({ size: 4096, forceStatic: false }))
            .setDescription(description.join('\n'))
            .addFields(
                { 
                    name: framework.translations.get('command.userinfo.creation', guildSettings.lang), 
                    value: TextFormatter.getTimestampFromDate(userCreateDate, 'd') + ` (${TextFormatter.getTimestampFromDate(userCreateDate, 'R')})` // '16/12/2017 (hace 1 año)' 
                }, { 
                    name: framework.translations.get('command.userinfo.login', guildSettings.lang), 
                    value: TextFormatter.getTimestampFromDate(userGuildJoinDate, 'd') + ` (${TextFormatter.getTimestampFromDate(userGuildJoinDate, 'R')})` // '16/12/2017 (hace 1 año)' 
                }, { 
                    name: framework.translations.get('command.userinfo.roles', guildSettings.lang), 
                    value: userRoles || 'Error getting roles'
                }
            )    
            .setFooter({
                text: framework.translations.get('global.requested', guildSettings.lang, {
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
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {

    }
}