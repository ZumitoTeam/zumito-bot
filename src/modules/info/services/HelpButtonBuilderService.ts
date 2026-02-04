import { ButtonBuilder, ButtonStyle } from 'discord.js';

export class HelpButtonBuilderService {
    buildCloseButton(trans: any, emojiFallback: any): ButtonBuilder {
        return new ButtonBuilder()
            .setCustomId('help.close')
            .setLabel(emojiFallback.getEmoji(trans('button.close'), trans('button.close')))
            .setStyle(ButtonStyle.Danger);
    }
}