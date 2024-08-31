import { Command, CommandParameters, CommandType, SelectMenuParameters, EmojiFallback, ServiceContainer } from "zumito-framework";

export class Prefix extends Command {

    categories = ['information'];
    examples: string[] = ['', '!', 'h!']; 
    args = [{
        name: "prefix",
        type: "string",
        optional: true,
    }];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;
    adminOnly = true;

    emojiFallback: EmojiFallback; 

    constructor() {
        super();
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }

    execute({ message, interaction, trans }: CommandParameters): void {

        /* Layou messages
            `${this.emojiFallback.getEmoji('', 'ℹ️')  } ${  trans('message', { prefix: ['h!'] })}`,
            `${this.emojiFallback.getEmoji('', '✅')  } ${ trans('changed', { prefix: ['h-'] })}`,
            `${this.emojiFallback.getEmoji('', '🚫')  } ${ trans('permissions', { permissions: ['Administrator'] })}`,
            `${this.emojiFallback.getEmoji('', '⚠️')  } ${ trans('directMSG')}`,
            */   

        (message || interaction!)?.reply({
            content: `${this.emojiFallback.getEmoji('', 'ℹ️')  } ${  trans('message', { prefix: ['h!'] })}`, 
            allowedMentions: { 
                repliedUser: false 
            },
            ephemeral:true
        });
    }

    selectMenu({  }: SelectMenuParameters): void {

    }
}