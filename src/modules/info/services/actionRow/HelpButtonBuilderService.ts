import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { EmojiFallback } from 'zumito-framework';

export class HelpButtonBuilderService {
    buildCloseButton(trans: (key: string) => string, emojiFallback: EmojiFallback): ButtonBuilder {
        return new ButtonBuilder()
            .setCustomId('help.close')
            .setLabel(emojiFallback.getEmoji('', trans('button.close')))
            .setStyle(ButtonStyle.Danger);
    }

    buildViewWebButton(trans: (key: string) => string): ButtonBuilder {
        return new ButtonBuilder()
            .setLabel(trans('button.viewWeb'))
            .setStyle(ButtonStyle.Link)
            .setURL('https://bot.zumito.dev/commands');
    }
}