import { EmbedBuilder, GuildMember, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters } from "zumito-framework";
import { config } from "../../../config/index.js";

export class Avatar extends Command {

    categories = ['information'];
    examples: string[] = ['', "@zumito"]; 
    args: CommandArgDefinition[] = [{
        name: "user",
        type: "member",
        optional: true,
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;
    

    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {
        let member: GuildMember = args.get('user') || (message||interaction!).member;
        if (!member) {
            (message||interaction!)?.reply({
                content: framework.translations.get('command.avatar.error', guildSettings.lang), 
                allowedMentions: { 
                    repliedUser: false 
                }
            });
            return;
        }
        let embed = new EmbedBuilder()
            .setTitle( framework.translations.get('command.avatar.title', guildSettings.lang, {
                user: member.user.globalName || member.user.displayName
            }))
            .setImage(member.user.displayAvatarURL({ 
                forceStatic: false, 
                size: 4096 
            }))
            .setColor(config.global.embeds.color);

            const row: any = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel(framework.translations.get('command.avatar.button.browser', guildSettings.lang))
                .setStyle(ButtonStyle.Link)
                .setURL(`${member.user.displayAvatarURL({forceStatic: false, size: 4096 })}`)
            );

        (message||interaction!)?.reply({ 
            embeds: [embed], 
            components: [row],
            allowedMentions: { 
                repliedUser: false 
            } 
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {}

}