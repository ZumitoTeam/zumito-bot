import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters, EmojiFallback, TextFormatter } from "zumito-framework";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
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

        let description = [
            '> ' + framework.translations.get('command.botinfo.hello', guildSettings.lang),
            ' > ',
            '> ' + framework.translations.get('command.botinfo.together', guildSettings.lang)

        ];

        const embed = new EmbedBuilder()

            .setTitle(client.user!.displayName)
            .setThumbnail(client.user!.displayAvatarURL({ 
                forceStatic: false, 
                size: 4096 
            }))
            .setDescription(description.join('\n'))
            .addFields(
                {
                    name: EmojiFallback.getEmoji(client, '', ':date:') + ' ' + framework.translations.get('command.botinfo.birthday', guildSettings.lang), 
                    value: TextFormatter.getTimestampFromDate(userCreateDate, 'd') ,
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
                    value: '``' + `${client.users.cache.size}` + '``',
                    inline: true
                },
                {
                    name: EmojiFallback.getEmoji(client, '', ':signal_strength:') + ' ' + framework.translations.get('command.botinfo.online', guildSettings.lang), 
                    value: '``' + this.uptimeToDHMS(client.uptime!) + '``',
                    inline: true
                }
            )
            .setColor(config.colors.default);

            const row: any = new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
            .setLabel(framework.translations.get('command.botinfo.button.website', guildSettings.lang))
            .setStyle(ButtonStyle.Link)
            .setURL(config.links.sites.website)
            .setEmoji('879510323676200980'),

            new ButtonBuilder()
            .setLabel(framework.translations.get('command.botinfo.button.support', guildSettings.lang))
            .setStyle(ButtonStyle.Link)
            .setURL(config.links.sites.support)
            .setEmoji('879509411285045279'),

            new ButtonBuilder()
            .setLabel(framework.translations.get('command.botinfo.button.invite', guildSettings.lang))
            .setStyle(ButtonStyle.Link)
            .setURL(config.links.sites.invite)
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
        let days = Math.floor(uptime / 86400000);
        let hours = Math.floor(uptime / 3600000);
        let minutes = Math.floor(uptime / 60000);
        let seconds = Math.floor(uptime / 1000);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

}
