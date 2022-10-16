import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters } from "zumito-framework";
import { EmbedBuilder } from "discord.js";
import { config } from "../../../config.js";
import { type } from "os";

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
            guilds: '2'
        }),
        framework.translations.get('command.botinfo.users', guildSettings.lang, {
            users: '13.526'
        }),
        framework.translations.get('command.botinfo.channels', guildSettings.lang, {
            channels: '52'
        })
        ];

        let ram = [
            framework.translations.get('command.botinfo.used', guildSettings.lang, {
                used: '48.66 MB'
            }),
            framework.translations.get('command.botinfo.available', guildSettings.lang, {
                available: '62.14 GB'
            }),
            framework.translations.get('command.botinfo.usage', guildSettings.lang, {
                usage: '0.1%'
            })
        ];

        let cpu = [
            framework.translations.get('command.botinfo.os', guildSettings.lang, {
                os: 'linux [x64]'
            }),
            framework.translations.get('command.botinfo.use', guildSettings.lang, {
                use: '57.23 MB'
            }),
            framework.translations.get('command.botinfo.cores', guildSettings.lang, {
                cores: '8'
            })
        ];

        let others = [
            framework.translations.get('command.botinfo.ping', guildSettings.lang, {
                ping: '109ms'
            }),
            framework.translations.get('command.botinfo.node', guildSettings.lang, {
                node: 'X.X.X'
            }),
            framework.translations.get('command.botinfo.uptime', guildSettings.lang, {
                uptime: '20 horas, 10 minutos, 3 segundos'
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

}