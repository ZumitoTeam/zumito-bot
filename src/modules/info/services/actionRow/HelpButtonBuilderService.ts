import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { EmojiFallback, ServiceContainer } from 'zumito-framework';

export class HelpButtonBuilderService {

    constructor(
        private emojiFallback = ServiceContainer.getService(EmojiFallback)
    ) {}

    async buildCloseButton(): Promise<ButtonBuilder> {
        return new ButtonBuilder()
            .setCustomId('help.close')
            .setLabel(await this.emojiFallback.getEmoji('', '❌'))
            .setStyle(ButtonStyle.Danger);
    }

    buildViewWebButton(trans: (key: string) => string): ButtonBuilder {
        return new ButtonBuilder()
            .setLabel(trans('button.viewWeb'))
            .setStyle(ButtonStyle.Link)
            .setURL('https://bot.zumito.dev/commands');
    }
}
