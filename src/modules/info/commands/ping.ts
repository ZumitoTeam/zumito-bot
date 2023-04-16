import { EmbedBuilder, GuildMember } from "discord.js";
import { Command, CommandArgDefinition, CommandParameters,  CommandType  } from "zumito-framework";
import { SelectMenuParameters } from "zumito-framework/dist/types/SelectMenuParameters";
import { config } from "../../../config/index.js";
import { type } from "os";

export class Ping extends Command {

    categories = ['information'];
    examples: string[] = ['']; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {
        (message || interaction!)?.reply({
            content: framework.translations.get('command.ping.emoji', guildSettings.lang) + ' ' + framework.translations.get('command.ping.pong', guildSettings.lang) + ' ' + `\`\`${Date.now() - (message||interaction!)?.createdTimestamp}ms\`\`` + ' | ' + framework.translations.get('command.ping.ws', guildSettings.lang) + ' ' + `\`\`${client.ws.ping}ms\`\``, 
            allowedMentions: { 
                repliedUser: false 
            }
        });
    }

    selectMenu({ path, interaction, client, framework }: SelectMenuParameters): void {

    }
}