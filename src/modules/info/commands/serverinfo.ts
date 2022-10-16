import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters  } from "zumito-framework";
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

        let text = "**" + framework.translations.get('command.serverinfo.no.description', guildSettings.lang) + "**"

        let text0 = framework.translations.get('command.serverinfo.id', guildSettings.lang, {
            id: "55454477489"
        })

        let text1 = framework.translations.get('command.serverinfo.owner', guildSettings.lang, {
            owner: "Fernandomema#4875"
        })

        let text2 = framework.translations.get('command.serverinfo.created', guildSettings.lang, {
            created: "16/12/2017 (hace 1 año)"
        })

        let text3 = framework.translations.get('command.serverinfo.language', guildSettings.lang, {
            language: "Español"
        })

        let text4 = framework.translations.get('command.serverinfo.members', guildSettings.lang, {
            members: "1545"
        })

        let text5 = framework.translations.get('command.serverinfo.upgrades', guildSettings.lang, {
            upgrades: "2"
        })

        let text6 = framework.translations.get('command.serverinfo.roles', guildSettings.lang, {
            roles: "58"
        })

        let text7 = framework.translations.get('command.serverinfo.verification', guildSettings.lang, {
            verification: "58"
        })

        let text8 = framework.translations.get('command.serverinfo.total', guildSettings.lang, {
            total: "58"
        })

        let text9 = framework.translations.get('command.serverinfo.announcements', guildSettings.lang, {
            announcements: "58"
        })

        let text10 = framework.translations.get('command.serverinfo.station', guildSettings.lang, {
            station: "58"
        })

        let text11 = framework.translations.get('command.serverinfo.threads', guildSettings.lang, {
            threads: "58"
        })

        let text12 = framework.translations.get('command.serverinfo.text', guildSettings.lang, {
            text: "58"
        })

        let text13 = framework.translations.get('command.serverinfo.voice', guildSettings.lang, {
            voice: "58"
        })

        let text14 = framework.translations.get('command.serverinfo.category', guildSettings.lang, {
            category: "58"
        })

        const embed = new EmbedBuilder()
            .setTitle('Zumito')
            .setThumbnail('https://media.tenor.com/_G9MmgZ9aJkAAAAM/aqua-konosuba.gif')
            .setDescription(
                text + '\n\n' +
                text0 + '\n' + 
                text1 + '\n' +
                text2 + '\n' + 
                text3
            )
            .addFields(
                {name: framework.translations.get('command.serverinfo.stats', guildSettings.lang), value: text4 + '\n' + text5 + '\n' + text6, inline: true},
                {name: framework.translations.get('command.serverinfo.details', guildSettings.lang), value: text7, inline: true },
                {name: framework.translations.get('command.serverinfo.channels', guildSettings.lang), value: text8 + '\n' + text9 + '\n' + text10 + '\n' + text11 + '\n' + text12 + '\n' + text13 + '\n' + text14}
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