import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters  } from "zumito-framework";
import { EmbedBuilder } from "discord.js";
import { config } from "../../../config.js";
import { type } from "os";

export class Serverbanner extends Command {

    categories = ['information'];
    examples: string[] = ['']; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {

        const embed = new EmbedBuilder()
            .setTitle(framework.translations.get('command.serverbanner.title', guildSettings.lang, {
                server: 'Zumito'
            }))
            .setDescription(framework.translations.get('command.serverbanner.full', guildSettings.lang) + '\n' + '[' + framework.translations.get('command.serverbanner.click', guildSettings.lang) + '](' + 'https://i.pinimg.com/originals/5c/5a/95/5c5a954162de32c14917e8a8f20393d3.gif' + ')')
            .setImage('https://i.pinimg.com/originals/5c/5a/95/5c5a954162de32c14917e8a8f20393d3.gif')
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