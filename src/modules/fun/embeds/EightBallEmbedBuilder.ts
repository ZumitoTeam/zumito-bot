import { EmbedBuilder } from 'zumito-framework/discord';
import { TranslationManager, ServiceContainer, EmojiFallback } from "zumito-framework";
import { config } from "../../../config/index.js";

export class EightBallEmbedBuilder {
    
    emojiFallback: EmojiFallback;
    translator: TranslationManager;

    constructor() {
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
        this.translator = ServiceContainer.getService(TranslationManager);
    }

    getEmbed({ question, answer, locale }: any) {

        const description = [

            `> ${  this.emojiFallback.getEmoji('', '🤔')  } ${  this.translator.get('eightball.question', locale)}`,
            `\n> \`\`\`${  question  }\`\`\``,
            '\n> ',
            `${  this.emojiFallback.getEmoji('', '🎱')  }${this.translator.get('eightball.answer', locale)}`,
            `\n> \`\`\`${  answer  }\`\`\``
        ];
      
        const EightBallEmbed = new EmbedBuilder()
        
            .setThumbnail(config.images.eightBall)
            .setDescription(description.join(''))
            .setColor(config.colors.default);
	
        return EightBallEmbed;
    }
}