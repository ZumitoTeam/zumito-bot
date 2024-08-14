import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters, EmojiFallback, TextFormatter } from "zumito-framework";
import { config } from "../../../config/index.js";
export class BotInfo extends Command {

    categories = ['information'];
    examples: string[] = ['']; 
    aliases = ["botstat"]; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {

        let userCreateDate = client.user!.createdAt;
        let date = new Date(userCreateDate);
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let year = date.getFullYear();
        let birthday = `${day}/${month}/${year}`;

        let description = [
            '> ' + framework.translations.get('command.botinfo.hello', guildSettings.lang),
            ' > ',
            '> ' + framework.translations.get('command.botinfo.together', guildSettings.lang)

        ];

        let totalTransmissionChannels = client.guilds.cache.reduce((total, guild) => guild.channels.cache.filter((channel) => channel.type == ChannelType.GuildVoice).size + total, 0)

        const embed = new EmbedBuilder()

            .setDescription(description.join('\n'))
            .addFields(
                {
                    name: EmojiFallback.getEmoji(client, '', ':date:') + ' ' + framework.translations.get('command.botinfo.birthday', guildSettings.lang), 
                    value: '``' + birthday + '``',
                    inline: true
                },
                {
                    name: EmojiFallback.getEmoji(client, '', ':japanese_castle:') + ' ' + framework.translations.get('command.botinfo.servers', guildSettings.lang), 
                    value: '``' + `${client.guilds.cache.size}` + '``',
                    inline: true
                },
                {
                    name: EmojiFallback.getEmoji(client, '', ':satellite:') + ' ' + framework.translations.get('command.botinfo.channels', guildSettings.lang), 
                    value: '``' + `${client.channels.cache.size}` + '``',
                    inline: true
                },
                {
                    name: EmojiFallback.getEmoji(client, '', '🙍‍♂️') + ' ' + framework.translations.get('command.botinfo.users', guildSettings.lang), 
                    value: '``' + `${client.users.cache.size}` + '``',
                    inline: true
                },
                {
                    name: EmojiFallback.getEmoji(client, '', ':headphones:') + ' ' + framework.translations.get('command.botinfo.transmissions', guildSettings.lang), 
                    value: '``' + `${totalTransmissionChannels}` + '``',
                    inline: true
                },
                {
                    name: EmojiFallback.getEmoji(client, '', ':signal_strength:') + ' ' + framework.translations.get('command.botinfo.online', guildSettings.lang), 
                    value: '``' + this.uptimeToDHMS(client.uptime!) + '``',
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

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {}

    uptimeToDHMS(uptime: number): string {
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

}
