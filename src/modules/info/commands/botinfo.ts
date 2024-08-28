/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, EmojiFallback, ServiceContainer } from "zumito-framework";
import { config } from "../../../config/index.js";

export class BotInfo extends Command {

    categories = ['information'];
    examples: string[] = ['']; 
    aliases = ["botstat"]; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    emojiFallback: EmojiFallback;

    constructor() {
        super();
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }

    execute({ message, interaction, client, framework, guildSettings }: CommandParameters): void {

        const userCreateDate = client.user!.createdAt;
        const date = new Date(userCreateDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const birthday = `${day}/${month}/${year}`;

        const description = [
            `> ${  framework.translations.get('command.botinfo.hello', guildSettings.lang, {
                name: client!.user!.displayName
            })}`,
            '> ',
            `> ${  framework.translations.get('command.botinfo.together', guildSettings.lang)}`

        ];

        const totalTransmissionChannels = client.guilds.cache.reduce((total, guild) => guild.channels.cache.filter((channel) => channel.type == ChannelType.GuildVoice).size + total, 0)

        const embed = new EmbedBuilder()

            .setDescription(description.join('\n'))

            .addFields(
                {
                    name: `${this.emojiFallback.getEmoji('', '📅')  } ${  framework.translations.get('command.botinfo.birthday', guildSettings.lang)}`, 
                    value: `\`\`${  birthday  }\`\``,
                    inline: true
                },
                {
                    name: `${this.emojiFallback.getEmoji('', '🏯')  } ${  framework.translations.get('command.botinfo.servers', guildSettings.lang)}`, 
                    value: '``' + `${client.guilds.cache.size}` + '``',
                    inline: true
                },
                {
                    name: `${this.emojiFallback.getEmoji('', '📡')  } ${  framework.translations.get('command.botinfo.channels', guildSettings.lang)}`, 
                    value: '``' + `${client.channels.cache.size}` + '``',
                    inline: true
                },
                {
                    name: `${this.emojiFallback.getEmoji('', '🙍‍♂️')  } ${  framework.translations.get('command.botinfo.users', guildSettings.lang)}`, 
                    value: '``' + `${client.users.cache.size}` + '``',
                    inline: true
                },
                {
                    name: `${this.emojiFallback.getEmoji('', '🎧')  } ${  framework.translations.get('command.botinfo.transmissions', guildSettings.lang)}`, 
                    value: '``' + `${totalTransmissionChannels}` + '``',
                    inline: true
                },
                {
                    name: `${this.emojiFallback.getEmoji('', '📶')  } ${  framework.translations.get('command.botinfo.online', guildSettings.lang)}`, 
                    value: `\`\`${  this.uptimeToDHMS(client.uptime!)  }\`\``,
                    inline: true
                }
            )
            .setColor(config.colors.default);

        if (client && client.user) {
            embed.setTitle(client.user.displayName)
        }
            
        if (client && client.user) {
            embed.setThumbnail(
                client.user.displayAvatarURL({ 
                    forceStatic: false, 
                    size: 4096  })
            );
        }

        const row: any = new ActionRowBuilder()
            
            .addComponents(

                new ButtonBuilder()
                    .setLabel(framework.translations.get('command.botinfo.button.website', guildSettings.lang))
                    .setStyle(ButtonStyle.Link)
                    .setURL(config.links.website)
                    .setEmoji('879510323676200980'),

                new ButtonBuilder()
                    .setLabel(framework.translations.get('command.botinfo.button.support', guildSettings.lang))
                    .setStyle(ButtonStyle.Link)
                    .setURL(config.links.support)
                    .setEmoji('879509411285045279'),

                new ButtonBuilder()
                    .setLabel(framework.translations.get('command.botinfo.button.invite', guildSettings.lang))
                    .setStyle(ButtonStyle.Link)
                    .setURL(config.links.invite)
                    .setEmoji('988649262042710026'),
            );
    
        (message || interaction!)?.reply({
            embeds: [embed],
            components: [row],
            allowedMentions: { 
                repliedUser: false 
            }
        });
    }

    uptimeToDHMS(uptime: number): string {
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

}
