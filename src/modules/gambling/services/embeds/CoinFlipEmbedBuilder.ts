import { EmbedBuilder } from 'zumito-framework/discord';
import { ServiceContainer, TranslationManager } from 'zumito-framework';
import { config } from "../../../../config/index.js";

export class CoinFlipEmbedBuilder {

    translator: TranslationManager;

    constructor() {
        this.translator = ServiceContainer.getService(TranslationManager);
    }

    getEmbed({ result, election, win, locale }: {
        result: string;
        election: "tail"|"head";
        win: boolean;
        locale: string;
    }) {

        const coinFlipEmbed = new EmbedBuilder()
            
            .setTitle(this.translator.get('coinflip.title', locale))
            .addFields( 
                { name: this.translator.get('coinflip.left', locale), value: `\`\`${result === "head" 
                    ? this.translator.get('coinflip.heads', locale)
                    : this.translator.get('coinflip.tails', locale) }\`\``, inline: true },
                { name: this.translator.get('coinflip.choice', locale), value: `\`\`${election === "head" 
                    ? this.translator.get('coinflip.heads', locale) 
                    : this.translator.get('coinflip.tails', locale)}\`\``, inline: true },
                { name: this.translator.get('coinflip.result',locale), value: `\`\`${win 
                    ? this.translator.get('coinflip.win', locale) 
                    : this.translator.get('coinflip.lose', locale)}\`\`` }
            )
            .setThumbnail(config.images.catflip)
            .setColor(config.colors.default);
            
        return coinFlipEmbed;
    }

    getNoEmbed({ locale }: any) {

        const coinFlipNoEmbed = new EmbedBuilder()
            
            .setTitle(this.translator.get('coinflip.title', locale))
            .setDescription(this.translator.get('coinflip.ask', locale))
            .setThumbnail(config.images.catflip)
            .setColor(config.colors.default);

        return coinFlipNoEmbed;

    }
}