
import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'zumito-framework/discord';
import { ServiceContainer, TranslationManager, EmojiFallback } from 'zumito-framework';

export class HelpSelectMenuBuilder {

    translator: TranslationManager;
    emojiFallback: EmojiFallback;

    constructor() {
        
        this.translator = ServiceContainer.getService(TranslationManager);
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }

    getCategorySelectMenu({ locale }: any) {

        const HelpCategorysSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('selectRoles')
            .setPlaceholder(this.translator.get('command.help.selectMenu.category', locale))
            .addOptions([
                new StringSelectMenuOptionBuilder()
                    .setLabel('Example')
                    .setDescription('Comandos aquí')
                    .setEmoji(this.emojiFallback.getEmoji('', '📦'))
                    .setValue('commands')
            ]);
            
        return HelpCategorysSelectMenu;
    }
}
