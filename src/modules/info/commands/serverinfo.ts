import { ChannelType, EmbedBuilder } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, EmojiFallback, TextFormatter, ServiceContainer } from "zumito-framework";
import { config } from "../../../config/index.js";

export class ServerInfo extends Command {

    categories = ['information'];
    examples: string[] = ['']; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    emojiFallback: EmojiFallback;

    constructor() {
        super();
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }

    async execute({ message, interaction, client, framework, guildSettings, trans }: CommandParameters): Promise<void> {

        const guildOwner = client.users.cache.get(message?.guild?.ownerId || interaction!.guild!.ownerId)!;
        const serverCreationDate = message?.guild?.createdAt || interaction!.guild!.createdAt;
        const description = [
            `**${  trans('no.description', guildSettings.lang)  }**\n`,
            trans('id', {
                id: message?.guild?.id || interaction?.guild?.id
            }),
            trans('owner', {
                owner: guildOwner.tag
            }),
            trans('created', {
                created: `${TextFormatter.getTimestampFromDate(serverCreationDate, 'd')  } (${TextFormatter.getTimestampFromDate(serverCreationDate, 'R')})`
            }),
            trans('language', {
                language: guildSettings.lang
            })
        ];

        const stats = [
            trans('members', {
                members: message?.guild?.memberCount || interaction?.guild?.memberCount
            }),
            trans('upgrades', {
                upgrades: message?.guild?.premiumSubscriptionCount || interaction?.guild?.premiumSubscriptionCount
            }),
            trans('roles', {
                roles: message?.guild?.roles.cache.size || interaction?.guild?.roles.cache.size
            })
        ];

        const channels = [
            trans('total', {
                total: message?.guild?.channels.cache.size || interaction?.guild?.channels.cache.size
            }),
            trans('announcements', {
                announcements: (message?.guild?.channels.cache || interaction!.guild!.channels.cache).filter(channel => channel.type === ChannelType.GuildAnnouncement).size
            }),
            trans('station', {
                station: (message?.guild?.channels.cache || interaction!.guild!.channels.cache).filter(channel => channel.type === ChannelType.GuildStageVoice).size
            }),
            trans('threads', {
                threads: (message?.guild?.channels.cache || interaction!.guild!.channels.cache).filter(channel => channel.type === ChannelType.PublicThread || channel.type === ChannelType.PrivateThread).size
            }),
            // trans('forum', {
            //     forum: (message?.guild?.channels.cache || interaction!.guild!.channels.cache).filter(channel => channel.type == ChannelType.GuildForum).size
            // }),
            trans('text', {
                text: (message?.guild?.channels.cache || interaction!.guild!.channels.cache).filter(channel => channel.type === ChannelType.GuildText).size
            }),
            trans('voice', {
                voice: (message?.guild?.channels.cache || interaction!.guild!.channels.cache).filter(channel => channel.type === ChannelType.GuildVoice).size
            }),
            trans('category', {
                category: (message?.guild?.channels.cache || interaction!.guild!.channels.cache).filter(channel => channel.type === ChannelType.GuildCategory).size
            })
        ]
        
        const embed = new EmbedBuilder()
            .setTitle(`${this.emojiFallback.getEmoji('974087795616407583', '🔸')  } ${   message?.guild?.name || interaction!.guild!.name}`)
            .setThumbnail(message?.guild?.iconURL({ forceStatic: false }) || interaction?.guild?.iconURL({ forceStatic: false }) || '')
            .setDescription(description.join('\n'))
            .addFields(
                {
                    name: `${this.emojiFallback.getEmoji('975563717439795250', '♻')  } ${  framework.translations.get('command.serverinfo.stats', guildSettings.lang)}`, 
                    value: stats.join('\n'), 
                    inline: true
                }, {
                    name: `${this.emojiFallback.getEmoji('975583443113095168', '📕')  } ${  framework.translations.get('command.serverinfo.details', guildSettings.lang)}`, 
                    value: trans('verification', {
                        verification: message?.guild?.verificationLevel || interaction?.guild?.verificationLevel
                    }), 
                    inline: true 
                }, {
                    name: `${this.emojiFallback.getEmoji('974540778305105930', '💬')  } ${  framework.translations.get('command.serverinfo.channels', guildSettings.lang)}`, 
                    value: channels.join('\n'),
                }
            )
            .setFooter({
                text: trans('$global.requested', {
                    user: message?.author.globalName || interaction?.user.globalName
                }),
                iconURL: message?.author.displayAvatarURL({ forceStatic: false }) || interaction?.user.displayAvatarURL({ forceStatic: false })
            })
            .setColor(config.colors.default);

        (message || interaction!)?.reply({
            embeds:[embed],
            allowedMentions: { 
                repliedUser: false 
            }
        });
    }

}