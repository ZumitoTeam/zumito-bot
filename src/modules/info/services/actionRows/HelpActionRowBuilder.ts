
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'zumito-framework/discord';
import { ServiceContainer, TranslationManager, EmojiFallback } from 'zumito-framework';
import { config } from "../../../../config/index.js";

export class HelpActionRowBuilder {

    translator: TranslationManager;
    emojiFallback: EmojiFallback;

    constructor() {
        
        this.translator = ServiceContainer.getService(TranslationManager);
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }

    getCloseroRow ({ locale }: any) {

        const HelpCloseRow  = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('help.close')
                    .setEmoji(this.emojiFallback.getEmoji('', '❌'))
                    .setStyle(ButtonStyle.Danger)
            )
            
            .addComponents(
                new ButtonBuilder()
                    .setLabel(this.translator.get('command.help.button.website', locale))
                    .setURL(config.links.commands)
                    .setStyle(ButtonStyle.Link)
            );

        return HelpCloseRow;
    }
}
