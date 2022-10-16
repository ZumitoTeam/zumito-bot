import { Command, CommandArgDefinition, CommandParameters, CommandType, SelectMenuParameters } from "zumito-framework";
import { EmbedBuilder } from "discord.js";
import { config } from "../../../config.js";

export class Botinfo extends Command {

    categories = ['information'];
    examples: string[] = ['', "@zumito"]; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'];
    //type = CommandType.any;

    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {

        const embed = new EmbedBuilder()

            .setThumbnail('https://media.discordapp.net/attachments/879845851416121365/879846987317510255/zumito-cool.png?width=459&height=572')
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