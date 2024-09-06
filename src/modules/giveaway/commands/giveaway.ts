import { EmbedBuilder } from "zumito-framework/discord"; // ActionRowBuilder, ButtonBuilder, ButtonStyle,
import { Command, CommandArgDefinition, CommandParameters, CommandType, EmojiFallback, SelectMenuParameters, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { config } from "../../../config/index.js";

export class Giveaway extends Command {

    categories = ['giveaway'];
    examples: string[] = ['']; 
    args: CommandArgDefinition[] = [];
    botPermissions = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'USE_EXTERNAL_EMOJIS'];
    type = CommandType.any;

    emojiFallback: EmojiFallback; 

    constructor() {
        super();
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }

    execute({ message, interaction, client, guildSettings, framework, trans }: CommandParameters): void {

        const prefix = this.getPrefix(guildSettings, framework);

        const description = [

            `> ${trans('greeting.0', { name: client!.user!.displayName })}`,
            `> ${trans('greeting.1')}`,
            '> ',
            `> ${  this.emojiFallback.getEmoji('','📋')  }${trans('greeting.2', { prefix: prefix })}`,
            '> ',
            `> ${trans('greeting.3')}`
        ];
        
        const embed = new EmbedBuilder()
        
            .setTitle(`${ this.emojiFallback.getEmoji('','🎉')} ${trans('title') }`)
            .setThumbnail(config.images.unboxing)
            .setDescription(description.join('\n'))
            .setColor(config.colors.default);

        /* const row: any = new ActionRowBuilder()
            
            .addComponents(

                new ButtonBuilder()
                    .setLabel(trans('button.create'))
                    .setCustomId('create')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(this.emojiFallback.getEmoji('','🎉')),

                new ButtonBuilder()
                    .setLabel(trans('button.list'))
                    .setCustomId('list')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(this.emojiFallback.getEmoji('','📖')),

                new ButtonBuilder()
                    .setLabel(trans('button.delete'))
                    .setCustomId('delete')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(this.emojiFallback.getEmoji('','🗑')),
            
            );
            */
        (message || interaction!)?.reply({
            embeds: [embed],
            // components: [row],
            allowedMentions: { 
                repliedUser: false 
            }
        });
    }
    async selectMenu({  }: SelectMenuParameters): Promise<void> {

    }
    getPrefix(guildSettings: any, framework?: ZumitoFramework): string {
        return ( guildSettings?.prefix || process.env.BOT_PREFIX || framework?.settings.defaultPrefix || "!");
    }
}