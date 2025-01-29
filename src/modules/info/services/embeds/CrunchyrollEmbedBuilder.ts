import { EmbedBuilder } from 'zumito-framework/discord';
import { ServiceContainer, TranslationManager } from 'zumito-framework';
import { config } from "../../../../config/index.js";

export class CrunchyrollEmbedBuilder {

    translator: TranslationManager;

    constructor() {
        this.translator = ServiceContainer.getService(TranslationManager);
    }

    getEmbed({ Source, SourceIcon, AnimeName, AnimeLink,  AnimeImage, Episode, EpisodeLink, AnimeDescription, locale }: any) {

        const description = [

            this.translator.get('crunchyroll.name', locale, {
                name: `[${  AnimeName  }]` + `(${  AnimeLink  })`
            }),

            this.translator.get('crunchyroll.episode', locale, {
                episode: `[${  Episode  }]` + `(${  EpisodeLink  })`
            }),

            this.translator.get('crunchyroll.descriptionAnime', locale,{
                description: `\n> ${ AnimeDescription}`
            })
        ];

        const crunchyrollEmbed = new EmbedBuilder()
            
            .setColor(config.colors.default)
            .setAuthor({
                name: Source,
                iconURL: SourceIcon
            })
            .setDescription(description.join('\n\n'))
            .setImage(AnimeImage);
            
        return crunchyrollEmbed;
    }
}