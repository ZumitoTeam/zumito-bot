import { EmbedBuilder, GuildMember, ActionRowBuilder, UserSelectMenuBuilder } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters, TextFormatter, EmojiFallback, ServiceContainer } from "zumito-framework";
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

    emojiFallback: EmojiFallback;

    constructor() {
        super();
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }
    
    execute({ message, interaction, args, client, framework, guildSettings, trans }: CommandParameters): void {

        let user = args.get('user') || (message||(interaction!)).member!.user;
        let member: GuildMember | undefined = (message||(interaction!)).guild?.members.cache.get(user.id) as unknown as GuildMember;
        let userCreateDate = user.createdAt;
        let userGuildJoinDate = member.joinedAt as Date;
        const isOwner = member?.guild && member.guild.ownerId === user?.id;

        const finalName = `${isOwner ? '👑 ' : ''}${user.globalName || user.displayName}`;
        
        let badges = user.flags.toArray();
        const badgeEmojiMap = {
            ActiveDeveloper: this.emojiFallback.getEmoji('1200907904543371284', '💻'), // 💻 Developer
            BugHunterLevel1: this.emojiFallback.getEmoji('1200907027896086598', '🐞'), // 🐞 Bug Hunter Level 1
            BugHunterLevel2: this.emojiFallback.getEmoji('1200907027896086598', '🐛'), // 🐛 Bug Hunter Level 2
            CertifiedModerator: this.emojiFallback.getEmoji('1200907027896086598', '🛡️'), // 🛡️ Certified Moderator
            HypeSquadOnlineHouse1: this.emojiFallback.getEmoji('1200907027896086598', '🏠'), // 🏠 HypeSquad House 1
            HypeSquadOnlineHouse2: this.emojiFallback.getEmoji('1200907027896086598', '🏡'), // 🏡 HypeSquad House 2
            HypeSquadOnlineHouse3: this.emojiFallback.getEmoji('1200910182914465842', '🏰'), // 🏰 HypeSquad House 3
            Hypesquad: this.emojiFallback.getEmoji('1200910182914465842', '🎉'), // 🎉 HypeSquad
            Partner: this.emojiFallback.getEmoji('1200910182914465842', '🤝'), // 🤝 Partner
            PremiumEarlySupporter: this.emojiFallback.getEmoji('1200910182914465842', '🌟'), // 🌟 Early Supporter
            VerifiedBot: this.emojiFallback.getEmoji('1200910182914465842', '🤖'), // 🤖 Verified Bot
            VerifiedDeveloper: this.emojiFallback.getEmoji('1200910182914465842', '🔧') // 🔧 Verified Developer
        };
        
        const badgesWithEmojis = badges
        .map((badge: string) => badgeEmojiMap[badge as keyof typeof badgeEmojiMap])
        .filter(Boolean) 
        .join(' ');


        let userRoles: any = member.roles.cache;
        if (userRoles.size > 10) {
            userRoles = trans('roles', {
                roles: userRoles.size
            });
        } else if (userRoles <= 1) {
            userRoles = trans('noRoles');
        } else {
            userRoles = userRoles.filter((r: any) => r.id !== (message||(interaction!)).guild?.id)
                .map((r: any) => r)
                .join(' • ');
        }

        let statusGame = member?.presence?.activities[0];
       
        let description = [];
        
        // Title
        description.push(
            trans('info'),
        );

        // Id
        description.push(
            trans('id', {
                id: user.id
            }),
        );

        // User
        description.push(
            trans('user', {
                user: user.username, 
            }),
        )

        // Name
        if (user.globalName) {
            description.push(
                trans('name', {
                    name: user.globalName, 
                }),
            )
        }

        // Nickname
        if (member.nickname) {
            description.push(
                trans('nickname', {
                    nick: (member.nickname || trans('noNickname'))
                }),
            )
        }

        // Color
        description.push(
            trans('color', {
                color: (member.roles.color?.hexColor || "#99AAB5").toUpperCase()
            }),
        )

        // Badges
        if (badgesWithEmojis) {
            description.push(
                trans('badges', {
                    badges: badgesWithEmojis
                })
            );
        }

        // Status
        description.push(
            trans('playing', {
                playing: statusGame || trans('noPlaying')
            })
        )

        const embed = new EmbedBuilder()
            .setTitle(finalName)
            .setURL(`https://discord.com/users/${user.id}`)
            .setThumbnail(member.displayAvatarURL({ size: 4096, forceStatic: false }))
            .setDescription(description.join('\n'))
            .addFields(
                { 
                    name: trans('membership'), 
                    value: TextFormatter.getTimestampFromDate(userCreateDate, 'f') + ` (${TextFormatter.getTimestampFromDate(userCreateDate, 'R')})`
                }, { 
                    name: trans('join', {
                        server: (message?.guild?.name || interaction!.guild!.name)
                    }), 
                    value: TextFormatter.getTimestampFromDate(userGuildJoinDate, 'f') + ` (${TextFormatter.getTimestampFromDate(userGuildJoinDate, 'R')})`
                }, { 
                    name: trans('roles'), 
                    value: userRoles || trans('noRoles')
                }
            )    
            .setFooter({
                text: framework.translations.get('global.requested', guildSettings.lang, {
                        user: message?.author.globalName || interaction?.user.globalName
                    }),
                iconURL: message?.author.displayAvatarURL({ forceStatic: false }) || interaction?.user.displayAvatarURL({ forceStatic: false })
            })
            .setColor((member.roles.color?.hexColor || "#99AAB5"));

            const select = new UserSelectMenuBuilder()
			.setCustomId('userinfo.user')
			.setPlaceholder(trans('select'));

            const row: any = new ActionRowBuilder()
			.addComponents(select);

        (message || interaction!)?.reply({ 
            embeds: [embed], 
            components: [row],
            allowedMentions: { 
                repliedUser: false 
            }
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {

    }
}
