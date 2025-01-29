import { EmbedBuilder } from 'zumito-framework/discord';
import { TranslationManager, ServiceContainer, EmojiFallback } from "zumito-framework";
import { config } from "../../../../config/index.js";

export class TriviaEmbedBuilder {
    
    translator: TranslationManager;
    emojiFallback: EmojiFallback;

    constructor() {
        this.translator = ServiceContainer.getService(TranslationManager);
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }

    getEmbed({ question, sponsor, options, time, locale }: any) {

        const description = [

            `### ${  question  }`,

            `\n\n ${  options}`,

            `\n\n ${  this.translator.get('trivia.remaining', locale, {
                time: time
            })} ${this.emojiFallback.getEmoji('', '🤔')}`
        ];

        const triviaEmbed = new EmbedBuilder()

            .setColor(config.colors.default)
            .setAuthor({
                name: this.translator.get('trivia.title', locale),
            })
            .setDescription(description.join(''))
            .setThumbnail(config.images.trivia)
            .setFooter({
                text: this.translator.get('trivia.brought', locale, {
                    sponsor: sponsor
                }),
            });
	
        return triviaEmbed;
    
    }
}