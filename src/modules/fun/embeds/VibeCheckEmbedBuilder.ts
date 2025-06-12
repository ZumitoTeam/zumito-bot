import { EmbedBuilder } from 'zumito-framework/discord';
import { TranslationManager, ServiceContainer } from 'zumito-framework';
import { config } from '../../../config/index.js';

export class VibeCheckEmbedBuilder {
    translator: TranslationManager;

    constructor() {
        this.translator = ServiceContainer.getService(TranslationManager);
    }

    getEmbed({ result, locale }: { result: 'good' | 'bad' | 'cursed'; locale: string }) {
        const images = config.images.vibeCheck || {};
        const imageUrl = images[result];
        const embed = new EmbedBuilder()
            .setDescription(this.translator.get(`vibecheck.${result}`, locale))
            .setImage(imageUrl)
            .setColor(config.colors.default);
        return embed;
    }
}
