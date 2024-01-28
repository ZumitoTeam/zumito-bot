import { EmbedBuilder } from "discord.js";
import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters, TextFormatter, EmojiFallback } from "zumito-framework";
import { config } from "../../../config/index.js";

export class UserInfo extends Command {

    categories = ['information'];
    examples: string[] = ['', '@zumito']; 
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
        const isOwner = member?.guild && member.guild.ownerId === user?.id;
        const ownerEmoji = isOwner ? '👑' : '';
        const finalName = `${ownerEmoji}`+ ' ' +`${isOwner ? user.globalName : user.displayName}`;
        
        let badges = user.flags.toArray();
        const badgeEmojiMap = {
            HypeSquadOnlineHouse1: EmojiFallback.getEmoji(client, '1200907027896086598', '🛡️'),
            HypeSquadOnlineHouse2: EmojiFallback.getEmoji(client, '1200907027896086598', '🛡️'),
            HypeSquadOnlineHouse3: EmojiFallback.getEmoji(client, '1200910182914465842', '🛡️'),
            ActiveDeveloper: EmojiFallback.getEmoji(client, '1200907904543371284', '💻')
          };
        let badgesWithEmojis = badges.map((badge: string | number) => badgeEmojiMap[badge as keyof typeof badgeEmojiMap]);


        let userRoles: any = member.roles.cache;
        if (userRoles.size > 10) {
            userRoles = framework.translations.get('command.userinfo.roles', guildSettings.language, {
                roles: userRoles.size
            });
        } else if (userRoles <= 1) {
            userRoles = framework.translations.get('command.userinfo.noRoles', guildSettings.language);
        } else {
            userRoles = userRoles.filter((r: any) => r.id !== (message||(interaction!)).guild?.id)
                .map((r: any) => r)
                .join(' • ');
        }

        let statusGame = member?.presence?.activities[0];
       
        let description = [
            framework.translations.get('command.userinfo.info', guildSettings.lang),
            framework.translations.get('command.userinfo.id', guildSettings.lang, {
                id: user.id
            }),
            framework.translations.get('command.userinfo.user', guildSettings.lang, {
                user: user.username, 
            }),
            framework.translations.get('command.userinfo.name', guildSettings.lang, {
                name: user.globalName, 
            }),
            framework.translations.get('command.userinfo.nickname', guildSettings.lang, {
                nick: (member.nickname || framework.translations.get('command.userinfo.noNickname', guildSettings.lang))
            }),
            framework.translations.get('command.userinfo.color', guildSettings.lang, {
                color: user.color
            }),
            framework.translations.get('command.userinfo.badges', guildSettings.lang, {
                badges: badgesWithEmojis.join(' ')
            }),
            framework.translations.get('command.userinfo.playing', guildSettings.lang, {
                playing: statusGame || framework.translations.get('command.userinfo.noPlaying', guildSettings.lang)
            })
        ];

        const embed = new EmbedBuilder()
            .setTitle(finalName)
            .setURL('https://discord.com/users/' + user.id)
            .setThumbnail(member.displayAvatarURL({ size: 4096, forceStatic: false }))
            .setDescription(description.join('\n'))
            .addFields(
                { 
                    name: framework.translations.get('command.userinfo.membership', guildSettings.lang), 
                    value: TextFormatter.getTimestampFromDate(userCreateDate, 'f') + ` (${TextFormatter.getTimestampFromDate(userCreateDate, 'R')})`
                }, { 
                    name: framework.translations.get('command.userinfo.join', guildSettings.lang, {
                        server: (message?.guild?.name || interaction!.guild!.name)
                    }), 
                    value: TextFormatter.getTimestampFromDate(userGuildJoinDate, 'f') + ` (${TextFormatter.getTimestampFromDate(userGuildJoinDate, 'R')})`
                }, { 
                    name: framework.translations.get('command.userinfo.roles', guildSettings.lang), 
                    value: userRoles || framework.translations.get('command.userinfo.noRoles', guildSettings.language)
                }
            )    
            .setFooter({
                text: framework.translations.get('global.requested', guildSettings.lang, {
                        user: message?.author.globalName || interaction?.user.globalName
                    }),
                iconURL: message?.author.displayAvatarURL({ forceStatic: false }) || interaction?.user.displayAvatarURL({ forceStatic: false })
            })
            .setColor(config.colors.default);

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