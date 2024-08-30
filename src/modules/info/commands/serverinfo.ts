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

    execute({ message, interaction, client, trans }: CommandParameters): void {

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

        const textChannels = channels.filter(channel => 
            channel.type === ChannelType.GuildText ||
            channel.type === ChannelType.GuildAnnouncement ||
            channel.type === ChannelType.GuildForum).size;

        const voiceChannels = channels.filter(channel => 
            channel.type === ChannelType.GuildVoice ||
            channel.type === ChannelType.GuildStageVoice).size;

        const threadChannels = channels.filter(channel => 
            channel.type === ChannelType.PublicThread ||
            channel.type === ChannelType.PrivateThread).size;

        const totalChannels = textChannels + voiceChannels + threadChannels;

        const embed = new EmbedBuilder()

            .setTitle((message?.guild?.name || interaction!.guild!.name))
            .setThumbnail(message?.guild?.iconURL({ forceStatic: false }) || interaction?.guild?.iconURL({ forceStatic: false }) || '')
            .addFields(
                {
                    name: `${this.emojiFallback.getEmoji('', '🆔')  } ${  trans('id')}`, 
                    value: `${message?.guild?.id || interaction!.guild!.id  }`, 
                    inline: true
                }, {
                    name: `${this.emojiFallback.getEmoji('', '👑')  } ${  trans('owner')}`,
                    value: guildOwner.toString(),
                    inline: true
                }, {
                    name: `${this.emojiFallback.getEmoji('', '📅')  } ${  trans('dateCreated')}`,
                    value: TextFormatter.getTimestampFromDate(serverCreationDate, 'd'),
                    inline: true
                }, {
                    name: `${this.emojiFallback.getEmoji('', '💬')  } ${  trans('channels', { channels: totalChannels })}`,
                    value: `${trans('text', { text: textChannels })  } | ${ 
                        trans('voice', { voice: voiceChannels })  } | ${ 
                        trans('thread', { thread: threadChannels })}`,
                    inline: true
                }, {
                    name: `${this.emojiFallback.getEmoji('', '👥')  } ${  trans('members')}`,
                    value: `${message?.guild?.memberCount || interaction?.guild?.memberCount  }`, 
                    inline: true
                }, {
                    name: `${this.emojiFallback.getEmoji('', '✨')  } ${  trans('upgrades')}`,
                    value: `${premiumSubscriptionCount  }`,
                    inline: true
                }, {
                    name: `${this.emojiFallback.getEmoji('', '🏜')  } ${  trans('emojis')}`,
                    value: `${message?.guild?.emojis.cache.size || interaction?.guild?.emojis.cache.size  }`,
                    inline: true
                }, {
                    name: `${this.emojiFallback.getEmoji('', '🗡')  } ${  trans('roles')}`,
                    value: `${rolesCount  }`,
                    inline: true
                }, {
                    name: `${this.emojiFallback.getEmoji('', '📖')  } ${  trans('verification')}`,
                    value: verificationText,
                    inline: true
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

    selectMenu(): void {

    }
}
