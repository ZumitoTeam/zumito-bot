import { EmbedBuilder } from 'discord.js';
import { ServiceContainer, TranslationManager } from 'zumito-framework';
import { config } from "../../../../config/index.js";

export class AvatarEmbedBuilderService {

    translator: TranslationManager;
    constructor() {
        this.translator = ServiceContainer.getService(TranslationManager);
    }

    buildAvatarEmbed (locale: string, name: string, avatarUrl: string, footerName: string, footerIconUrl: string): EmbedBuilder {

        return new EmbedBuilder()
        
            .setTitle(this.translator.get('command.avatar.title', locale, {
                name: name
            }))
            
            .setFooter ({
                text: this.translator.get('global.requested', locale, {
                    user: footerName
                }),
                iconURL: footerIconUrl
            })
            .setImage(avatarUrl)
            .setColor(config.colors.default);
    }
}