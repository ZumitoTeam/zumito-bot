import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters, EmojiFallback  } from "zumito-framework";
import { EmbedBuilder } from "discord.js";
import { config } from "../../../config.js";
import { type } from "os";

export class Serverinfo extends Command {

    categories = ['information'];
    examples: string[] = ['']; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {

        let description = [
            "**" + framework.translations.get('command.serverinfo.no.description', guildSettings.lang) + "**\n",
            framework.translations.get('command.serverinfo.id', guildSettings.lang, {
                id: "55454477489"
            }),
            framework.translations.get('command.serverinfo.owner', guildSettings.lang, {
                owner: "Fernandomema#4875"
            }),
            framework.translations.get('command.serverinfo.created', guildSettings.lang, {
                created: "16/12/2017 (hace 1 año)"
            }),
            framework.translations.get('command.serverinfo.language', guildSettings.lang, {
                language: "Español"
            })
        ];

        let stats = [
            framework.translations.get('command.serverinfo.members', guildSettings.lang, {
                members: "1545"
            }),
            framework.translations.get('command.serverinfo.upgrades', guildSettings.lang, {
                upgrades: "2"
            }),
            framework.translations.get('command.serverinfo.roles', guildSettings.lang, {
                roles: "58"
            })
        ];

        let channels = [
            framework.translations.get('command.serverinfo.total', guildSettings.lang, {
                total: "58"
            }),
            framework.translations.get('command.serverinfo.announcements', guildSettings.lang, {
                announcements: "58"
            }),
            framework.translations.get('command.serverinfo.station', guildSettings.lang, {
                station: "58"
            }),
            framework.translations.get('command.serverinfo.threads', guildSettings.lang, {
                threads: "58"
            }),
            framework.translations.get('command.serverinfo.forum', guildSettings.lang, {
                forum: "58"
            }),
            framework.translations.get('command.serverinfo.text', guildSettings.lang, {
                text: "58"
            }),
            framework.translations.get('command.serverinfo.voice', guildSettings.lang, {
                voice: "58"
            }),
            framework.translations.get('command.serverinfo.category', guildSettings.lang, {
                category: "58"
            })
        ]
        
        const embed = new EmbedBuilder()
            .setTitle(EmojiFallback.getEmoji(client, '974087795616407583', '🔸') + ' ' + 'Zumito')
            .setThumbnail('https://media.tenor.com/_G9MmgZ9aJkAAAAM/aqua-konosuba.gif')
            .setDescription(description.join('\n'))
            .addFields(
                {
                    name: EmojiFallback.getEmoji(client, '975563717439795250', '♻') + ' ' + framework.translations.get('command.serverinfo.stats', guildSettings.lang), 
                    value: stats.join('\n'), 
                    inline: true
                }, {
                    name: EmojiFallback.getEmoji(client, '975583443113095168', '📕') + ' ' + framework.translations.get('command.serverinfo.details', guildSettings.lang), 
                    value: framework.translations.get('command.serverinfo.verification', guildSettings.lang, {
                        verification: "58"
                    }), 
                    inline: true 
                }, {
                    name: EmojiFallback.getEmoji(client, '974540778305105930', '💬') + ' ' + framework.translations.get('command.serverinfo.channels', guildSettings.lang), 
                    value: channels.join('\n'),
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
            embeds:[embed],
            allowedMentions: { 
                repliedUser: false 
            }
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {

    }
}