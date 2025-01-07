import { EmbedBuilder } from 'zumito-framework/discord';
import { TranslationManager, ServiceContainer, EmojiFallback } from "zumito-framework";
import { config } from "../../../config/index.js";

export class BananaEmbedBuilder {
    
    emojiFallback: EmojiFallback;
    translator: TranslationManager;

    constructor() {
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
        this.translator = ServiceContainer.getService(TranslationManager);
    }

    getEmbed({ AuthorName, AuthorIcon, UserName, UserIcon, RandomNumber, locale }: any) {
      
        const BananaEmbed = new EmbedBuilder()
        
            .setAuthor({
                name: AuthorName,
                iconURL:(AuthorIcon)
            })
            .setDescription(`${this.translator.get('banana.greeting', locale, {
                name: UserName,
                banana: RandomNumber
            })  } ${ this.emojiFallback.getEmoji('', '😯')}`)
            .setImage(config.images.banana)
            .setFooter({
                text: this.translator.get('banana.rating', locale, {
                    name: UserName,
                }),
                iconURL: UserIcon
            })
            .setColor(config.colors.default);
	
        return BananaEmbed;
    }
}