import { EmbedBuilder, GuildMember } from "discord.js";
import { config } from "../../../config.js";
import { Command, CommandArgDefinition, CommandParameters,  CommandType, EmojiFallback } from "zumito-framework";
import { SelectMenuParameters } from "zumito-framework/dist/types/SelectMenuParameters";
import { type } from "os";

export class Ping extends Command {

    categories = ['information'];
    examples: string[] = ['']; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    execute({ message, interaction, args, client, framework, guildSettings, trans }: CommandParameters): void {
        (message || interaction!)?.reply({
            content: '🏓' + ' ' + trans('pong') + ' ' + `\`\`${Date.now() - (message||interaction!)?.createdTimestamp}ms\`\`` + ' | ' + trans('ws') + ' ' + `\`\`${client.ws.ping}ms\`\``, 
            allowedMentions: { 
                repliedUser: false 
            }
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {

    }
}