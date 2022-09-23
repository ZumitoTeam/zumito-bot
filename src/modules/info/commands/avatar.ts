import { EmbedBuilder, GuildMember } from "discord.js";
import { config } from "../../../config.js";
import { Command, CommandArgDefinition, CommandParameters } from "zumito-framework";
import { SelectMenuParameters } from "zumito-framework/dist/types/SelectMenuParameters";

export class Avatar extends Command {

    categories = ['information'];
    examples: string[] = ['', "@zumito"]; 
    args: CommandArgDefinition[] = [{
        name: "user",
        type: "user",
        optional: true,
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'];

    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {
        let member: GuildMember = args.get('user') || (message||interaction!).member;
        if (!member) {
            (message||interaction!)?.reply({
                content: "Error while getting the user.",
            });
            return;
        }
        let embed = new EmbedBuilder()
            .setTitle(`${member.user.tag}'s avatar`)
            .setImage(member.user.displayAvatarURL({ 
                forceStatic: false, 
                size: 4096 
            }))
            .setFooter({
                text: `Requested by ${message?.author.tag || interaction?.user.tag}`,
                iconURL: message?.author.displayAvatarURL({ forceStatic: false }) || interaction?.user.displayAvatarURL({ forceStatic: false })
            })
            .setTimestamp(new Date())
            .setColor(config.embeds.color);

        (message||interaction!)?.reply({
            embeds: [embed]
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {}

}