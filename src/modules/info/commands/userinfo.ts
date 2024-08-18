import { EmbedBuilder, GuildMember, ActionRowBuilder, StringSelectMenuBuilder, Client } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters, TextFormatter, EmojiFallback, ServiceContainer, ZumitoFramework } from "zumito-framework";
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

    client: Client;
    framework: ZumitoFramework;
    emojiFallback: EmojiFallback;

    constructor() {
        super();
        this.client = ServiceContainer.getService(Client.name) as Client;
        this.framework = ServiceContainer.getService(ZumitoFramework.name) as ZumitoFramework;
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }
    
    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {

        let user = args.get('user') || (message||(interaction!)).member!.user;
        let member: GuildMember | undefined = (message||(interaction!)).guild?.members.cache.get(user.id) as unknown as GuildMember;
        let userCreateDate = user.createdAt;
        let userGuildJoinDate = member.joinedAt as Date;
        const isOwner = member?.guild && member.guild.ownerId === user?.id;
        const ownerEmoji = isOwner ? '👑' : '';
        const finalName = `${ownerEmoji}`+ ' ' +`${isOwner ? user.globalName : user.displayName}`;
        
        let badges = user.flags.toArray();

        // Flags doc: https://discord-api-types.dev/api/discord-api-types-v10/enum/UserFlags
        const badgeEmojiMap = {
            ActiveDeveloper: this.emojiFallback.getEmoji('1200907904543371284', '💻'),
            BotHTTPInteractions: this.emojiFallback.getEmoji('1200907027896086598', '🎈'),
            BugHunterLevel1: this.emojiFallback.getEmoji('1200907027896086598', '🧨'),
            BugHunterLevel2: this.emojiFallback.getEmoji('1200907027896086598', '🎎'),
            CertifiedModerator: this.emojiFallback.getEmoji('1200907027896086598', '🎭'),
            Collaborator: this.emojiFallback.getEmoji('1200907027896086598', '👓'),
            DisablePremium: this.emojiFallback.getEmoji('1200907027896086598', '🥼'),
            HasUnreadUrgentMessages: this.emojiFallback.getEmoji('1200907027896086598', '🥻'),
            HypeSquadOnlineHouse1: this.emojiFallback.getEmoji('1200907027896086598', '💄'),
            HypeSquadOnlineHouse2: this.emojiFallback.getEmoji('1200907027896086598', '👑'),
            HypeSquadOnlineHouse3: this.emojiFallback.getEmoji('1200910182914465842', '✨'),
            Hypesquad: this.emojiFallback.getEmoji('1200910182914465842', '🎠'),
            MFASMS: this.emojiFallback.getEmoji('1200910182914465842', '🕶'),
            Partner: this.emojiFallback.getEmoji('1200910182914465842', '📯'),
            PremiumEarlySupporter: this.emojiFallback.getEmoji('1200910182914465842', '📀'),
            PremiumPromoDismissed: this.emojiFallback.getEmoji('1200910182914465842', '🔮'),
            Quarantined: this.emojiFallback.getEmoji('1200910182914465842', '🔍'),
            RestrictedCollaborator: this.emojiFallback.getEmoji('1200910182914465842', '📕'),
            Spammer: this.emojiFallback.getEmoji('1200910182914465842', '🔍'),
            Staff: this.emojiFallback.getEmoji('1200910182914465842', '🎪'),
            TeamPseudoUser: this.emojiFallback.getEmoji('1200910182914465842', '🖼'),
            VerifiedBot:this.emojiFallback.getEmoji('1200910182914465842', '🚬'),
            VerifiedDeveloper: this.emojiFallback.getEmoji('1200910182914465842', '🔉')
            
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
       
        let description = [];
        
        // Title
        description.push(
            framework.translations.get('command.userinfo.info', guildSettings.lang),
        );

        // Id
        description.push(
            framework.translations.get('command.userinfo.id', guildSettings.lang, {
                id: user.id
            }),
        );

        // User
        description.push(
            framework.translations.get('command.userinfo.user', guildSettings.lang, {
                user: user.username, 
            }),
        )

        // Name
        if (user.globalName) {
            description.push(
                framework.translations.get('command.userinfo.name', guildSettings.lang, {
                    name: user.globalName, 
                }),
            )
        }

        // Nickname
        if (member.nickname) {
            description.push(
                framework.translations.get('command.userinfo.nickname', guildSettings.lang, {
                    nick: (member.nickname || framework.translations.get('command.userinfo.noNickname', guildSettings.lang))
                }),
            )
        }

        // Color
        description.push(
            framework.translations.get('command.userinfo.color', guildSettings.lang, {
                color: (member.roles.color?.hexColor || "#99AAB5").toUpperCase()
            }),
        )

        // Badges
        if (badgesWithEmojis.length > 0) {
            description.push(
                framework.translations.get('command.userinfo.badges', guildSettings.lang, {
                    badges: badgesWithEmojis.join(' ')
                }),
            )
        }

        // Status
        description.push(
            framework.translations.get('command.userinfo.playing', guildSettings.lang, {
                playing: statusGame || framework.translations.get('command.userinfo.noPlaying', guildSettings.lang)
            })
        )

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

            const option = {
                label: user.globalName || user.displayName + ' ' + user.displayName || user.displayName,
                value: user.id
            };
            

            const select = new StringSelectMenuBuilder()
			.setCustomId('userinfo.user')
			.setPlaceholder(framework.translations.get('command.userinfo.select', guildSettings.lang))
			.addOptions([option]);

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