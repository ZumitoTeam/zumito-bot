import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters } from "zumito-framework";
import { EmbedBuilder } from "discord.js";
import { config } from "../../../config.js";
import { cpus } from "os";

export class Botinfo extends Command {

    categories = ['information'];
    examples: string[] = ['']; 
    aliases = ["botstatus"]; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {

        let information = [
            framework.translations.get('command.botinfo.guilds', guildSettings.lang, {
                guilds: client.guilds.cache.size
            }),
            framework.translations.get('command.botinfo.users', guildSettings.lang, {
                users: client.users.cache.size
            }),
            framework.translations.get('command.botinfo.channels', guildSettings.lang, {
                channels: client.channels.cache.size
            })
        ];

        let ram = [
            framework.translations.get('command.botinfo.used', guildSettings.lang, {
                used: (Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100) + 'MB'
            }),
            framework.translations.get('command.botinfo.available', guildSettings.lang, {
                available: (Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100) + 'MB'
            }),
            framework.translations.get('command.botinfo.usage', guildSettings.lang, {
                usage: (Math.round(process.memoryUsage().heapUsed / process.memoryUsage().heapTotal * 10000) / 100) + '%'
            })
        ];

        let cpu = [
            framework.translations.get('command.botinfo.os', guildSettings.lang, {
                os: process.platform
            }),
            framework.translations.get('command.botinfo.use', guildSettings.lang, {
                use: (Math.round(process.cpuUsage().user / 1024 / 1024 * 100) / 100) + 'MB'
            }),
            framework.translations.get('command.botinfo.cores', guildSettings.lang, {
                cores: cpus().length
            })
        ];

        let others = [
            framework.translations.get('command.botinfo.ping', guildSettings.lang, {
                ping: client.ws.ping + 'ms'
            }),
            framework.translations.get('command.botinfo.node', guildSettings.lang, {
                node: process.version
            }),
            // Uptime in days, hours, minutes, seconds
            framework.translations.get('command.botinfo.uptime', guildSettings.lang, {
                uptime: this.uptimeToDHMS(client.uptime!)
            })
        ];

        const embed = new EmbedBuilder()

            .setTitle('Bot.name')
            .setThumbnail('https://media.discordapp.net/attachments/879845851416121365/879846987317510255/zumito-cool.png?width=459&height=572')
            .addFields(
                {
                    name: framework.translations.get('command.botinfo.information', guildSettings.lang), 
                    value: information.join('\n'),
                    inline: true
                }, {
                    name: framework.translations.get('command.botinfo.ram', guildSettings.lang),
                    value: ram.join('\n'),
                    inline: true
                }, {
                    name: framework.translations.get('command.botinfo.cpu', guildSettings.lang),
                    value: cpu.join('\n'),
                    inline: true
                }, {
                    name: framework.translations.get('command.botinfo.others', guildSettings.lang),
                    value: others.join('\n')
                }
            )
            .setFooter({
                text: framework.translations.get('global.requested', guildSettings.lang, {
                    user: message?.author.tag || interaction?.user.tag
                }),
                iconURL: message?.author.displayAvatarURL({ forceStatic: false }) || interaction?.user.displayAvatarURL({ forceStatic: false })
            })
            .setColor(config.embeds.color);
    
        (message || interaction!)?.reply({
            embeds: [embed],
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