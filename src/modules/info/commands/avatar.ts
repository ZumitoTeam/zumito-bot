import { EmbedBuilder, GuildMember } from "discord.js";
import { Command, CommandArgDefinition, CommandParameters,  CommandType  } from "zumito-framework";
import { SelectMenuParameters } from "zumito-framework/dist/types/SelectMenuParameters";
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
                user: member.user.tag
            }))
            .setDescription(`[Avatar URL](${member.user.displayAvatarURL({forceStatic: false, size: 4096 })})`)
            .setImage(member.user.displayAvatarURL({ 
                forceStatic: false, 
                size: 4096 
            }))
            .setFooter({
                text: framework.translations.get('global.requested', guildSettings.lang, {
                    user: message?.author.tag || interaction?.user.tag
                }),
                iconURL: message?.author.displayAvatarURL({ forceStatic: false }) || interaction?.user.displayAvatarURL({ forceStatic: false })
            })
            .setColor(config.global.embeds.color);

        (message||interaction!)?.reply({ 
            embeds: [embed], 
            allowedMentions: { 
                repliedUser: false 
            } 
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {}

}