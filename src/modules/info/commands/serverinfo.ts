import { ChannelType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "zumito-framework/discord";
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

    async execute({ message, interaction, client, trans }: CommandParameters): Promise<void> {

        const guildOwner = client.users.cache.get(message?.guild?.ownerId || interaction!.guild!.ownerId)!;
        const serverCreationDate = message?.guild?.createdAt || interaction!.guild!.createdAt;
        const premiumSubscriptionCount = message?.guild?.premiumSubscriptionCount || interaction?.guild?.premiumSubscriptionCount || 0;

        const verificationLevels: { [key: number]: string } = {
            0: trans('none'), 
            1: trans('low'),
            2: trans('medium'),
            3: trans('high'),
            4: trans('very_high')
        };
        
        const verificationLevel = (message?.guild?.verificationLevel || interaction?.guild?.verificationLevel) as 0 | 1 | 2 | 3 | 4;
        const verificationText = verificationLevels[verificationLevel] || trans('unknown');
        const rolesCount = (message?.guild?.roles.cache || interaction!.guild!.roles.cache).filter(role => role.name !== '@everyone').size;
    
        const channels = message?.guild?.channels.cache || interaction!.guild!.channels.cache;
        
        const textChannels = channels.filter(channel => channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement || channel.type === ChannelType.GuildForum).size;
        const voiceChannels = channels.filter(channel => channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice).size;
        const threadChannels = channels.filter(channel => channel.type === ChannelType.PublicThread || channel.type === ChannelType.PrivateThread).size;
        const totalChannels = textChannels + voiceChannels + threadChannels;

        const description = [

            `${this.emojiFallback.getEmoji('', '🆔') } ${  trans('id', {
                id: message?.guild?.id || interaction!.guild!.id
            })}`,

            `${this.emojiFallback.getEmoji('', '👑')  } ${  trans('owner', {
                owner: guildOwner
            })}`,

            `${this.emojiFallback.getEmoji('', '📅')  } ${  trans('dateCreated', {
                dateCreated: TextFormatter.getTimestampFromDate(serverCreationDate, 'd')
            })}`,

            `${this.emojiFallback.getEmoji('', '👥')  } ${  trans('members', {
                members: message?.guild?.memberCount || interaction?.guild?.memberCount
            })}`,

            `${this.emojiFallback.getEmoji('', '💬')  } ${  trans('channels', { 
                channels: totalChannels 
            })}`,

            `${this.emojiFallback.getEmoji('', '⭐')  } ${  trans('roles', {
                roles: rolesCount
            })}`,

            `${this.emojiFallback.getEmoji('', '🏜')  } ${  trans('emojis', {
                emojis: message?.guild?.emojis.cache.size || interaction?.guild?.emojis.cache.size
            })}`,

            `${this.emojiFallback.getEmoji('', '✨')  } ${  trans('upgrades', {
                upgrades: premiumSubscriptionCount
            })}`,

            `${this.emojiFallback.getEmoji('', '📖')  } ${  trans('verification', {
                verification: `**${  verificationText  }**`
            })}`
        ];

        const embed = new EmbedBuilder()

            .setTitle((message?.guild?.name || interaction!.guild!.name))
            .setThumbnail(message?.guild?.iconURL({ forceStatic: false }) || interaction?.guild?.iconURL({ forceStatic: false }) || '')
            .setDescription(description.join('\n'))
            .setFooter({
                text: trans('$global.requested', {
                    user: message?.author.globalName || interaction?.user.globalName
                }),
                iconURL: message?.author.displayAvatarURL({ forceStatic: false }) || interaction?.user.displayAvatarURL({ forceStatic: false })
            })
            .setColor(config.colors.default);
            
        const select = new StringSelectMenuBuilder()
            .setCustomId('select')
            .addOptions(

                new StringSelectMenuOptionBuilder()
                    .setLabel(trans('select.server.title'))
                    .setValue('server')
                    .setDescription(trans('select.server.description'))
                    .setEmoji(this.emojiFallback.getEmoji('', '🏠'))
                    .setDefault(true),

                new StringSelectMenuOptionBuilder()
                    .setLabel(trans('select.roles.title'))
                    .setValue('roles')
                    .setDescription(trans('select.roles.description'))
                    .setEmoji(this.emojiFallback.getEmoji('', '⭐')),

                new StringSelectMenuOptionBuilder()
                    .setLabel(trans('select.emojis.title'))
                    .setValue('emojis')
                    .setDescription(trans('select.roles.description'))
                    .setEmoji(this.emojiFallback.getEmoji('', '🏜')),
            );

        const row: any = new ActionRowBuilder()
            .addComponents(select);
            
        (message || interaction!)?.reply({
            embeds:[embed],
            components: [row],
            allowedMentions: { 
                repliedUser: false 
            }
        });
    }

}

