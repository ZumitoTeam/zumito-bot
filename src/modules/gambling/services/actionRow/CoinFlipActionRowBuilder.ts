import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'zumito-framework/discord';
import { ServiceContainer, TranslationManager } from 'zumito-framework';

export class CoinFlipActionRowBuilder {

    translator: TranslationManager;

    constructor() {
        this.translator = ServiceContainer.getService(TranslationManager);
    }

    getRow({ locale }: any) {
        const coinflipActionRow = new ActionRowBuilder()
        
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('coinflip.head')
                    .setLabel(this.translator.get('coinflip.heads', locale))
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('coinflip.tail')
                    .setLabel(this.translator.get('coinflip.tails', locale))
                    .setStyle(ButtonStyle.Secondary)
            );
        return coinflipActionRow;
    }
}