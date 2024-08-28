import { Command, CommandArgDefinition, CommandParameters, CommandType, EmojiFallback, ServiceContainer } from "zumito-framework";

export class Ping extends Command {

    categories = ['information'];
    examples: string[] = ['']; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    emojiFallback: EmojiFallback; 

    constructor() {
        super();
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }

    execute({ message, interaction, client, trans }: CommandParameters): void {
        
        (message || interaction!)?.reply({
            content: `${this.emojiFallback.getEmoji('', '🏓')  } ${  trans('pong')  } ` + `\`\`${Date.now() - (message||interaction!)?.createdTimestamp}ms\`\`` + ` | ${  trans('ws')  } ` + `\`\`${client.ws.ping}ms\`\``, 
            allowedMentions: { 
                repliedUser: false 
            }
        });
    }

}