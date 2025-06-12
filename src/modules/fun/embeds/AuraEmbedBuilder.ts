import { EmbedBuilder } from 'zumito-framework/discord';
import { TranslationManager, ServiceContainer } from 'zumito-framework';
import { config } from '../../../config/index.js';

export class AuraEmbedBuilder {
    translator: TranslationManager;

    constructor() {
        this.translator = ServiceContainer.getService(TranslationManager);
    }

    getEmbed({ color, element, description, locale }: { color: string; element: string; description: string; locale: string }) {
        const embed = new EmbedBuilder()
            .setDescription(this.translator.get('aura.result', locale, { color, element, description }))
            .setColor(config.colors.default);
        return embed;
    }
}
