import { EmbedBuilder, GuildMember, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { config } from "../../../config.js";
import { Command, CommandArgDefinition, CommandParameters,  CommandType  } from "zumito-framework";
import { SelectMenuParameters } from "zumito-framework/dist/types/SelectMenuParameters";
import { type } from "os";

export class Invite extends Command {

    categories = ['information'];
    examples: string[] = ['']; 
    aliases = ["inv"]; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;


    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {

        const embed = new EmbedBuilder()
            .setTitle(framework.translations.get('command.invite.author', guildSettings.lang) + ' ' + config.name)
            .setDescription(framework.translations.get('command.invite.short.description', guildSettings.lang))
            .setImage(config.botInviteImgURL)
            .setColor(config.embeds.color)

        const row: any = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel(framework.translations.get('command.invite.button.invite', guildSettings.lang))
            .setStyle(ButtonStyle.Link)
            .setURL(config.botInviteURL)
            .setEmoji('988649262042710026'),

            new ButtonBuilder()
            .setLabel(framework.translations.get('command.invite.button.support', guildSettings.lang))
            .setStyle(ButtonStyle.Link)
            .setURL(config.supportServerURL)
            .setEmoji('879509411285045279'),

            new ButtonBuilder()
            .setLabel(framework.translations.get('command.invite.button.website', guildSettings.lang))
            .setStyle(ButtonStyle.Link)
            .setURL(config.websiteURL)
            .setEmoji('879510323676200980')
        );

        (message || interaction!)?.reply({
            embeds: [embed],
            allowedMentions: { 
                repliedUser: false
            },
            components: [row],
            ephemeral: true
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {

    }
}