import { Command, CommandArgDefinition, CommandParameters,  CommandType } from "zumito-framework";
import { EmbedBuilder, GuildMember } from "discord.js";
import { config } from "../../../config.js";
import { SelectMenuParameters } from "zumito-framework/dist/types/SelectMenuParameters";
import { type } from "os";

export class Userinfo extends Command {

    categories = ['information'];
    examples: string[] = ['', '<@878950861122985996>']; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {

        let text = framework.translations.get('command.userinfo.user', guildSettings.lang, {
            name: "William Acosta#0001"
        })

        let text0 = framework.translations.get('command.userinfo.nickname', guildSettings.lang, {
            nick: framework.translations.get('command.userinfo.noNickname', guildSettings.lang)
        })

        let text1 = framework.translations.get('command.userinfo.id', guildSettings.lang, {
            id: "57547544564564"
        })

        let text2 = framework.translations.get('command.userinfo.color', guildSettings.lang, {
            color: "#45656"
        })

        let text3 = framework.translations.get('command.userinfo.playing', guildSettings.lang, {
            playing: framework.translations.get('command.userinfo.noPlaying', guildSettings.lang)
        })

        const embed = new EmbedBuilder()
            .setTitle(framework.translations.get('command.userinfo.title', guildSettings.lang))
            .setThumbnail('https://i.pinimg.com/originals/d9/56/9b/d9569bbed4393e2ceb1af7ba64fdf86a.jpg')
            .setDescription(
                text + "\n" + 
                text0 + "\n" + 
                text1 + "\n" +
                text2 + "\n" +
                text3 + "\n"
                )
            .addFields(
                { name: framework.translations.get('command.userinfo.creation', guildSettings.lang), value: 'nddndn' },
                { name: framework.translations.get('command.userinfo.login', guildSettings.lang), value: "dkdkdk" },
                { name: framework.translations.get('command.userinfo.roles', guildSettings.lang), value: framework.translations.get('command.userinfo.noRoles', guildSettings.lang) }
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

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {

    }
}