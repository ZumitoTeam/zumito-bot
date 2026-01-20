import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'zumito-framework/discord';

export class WordleButtonsService {
    buildControls(customIdPrefix: string, disabled = false): any[] {
        const ctrl = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId(`${customIdPrefix}.enter`).setLabel('ENTER').setStyle(ButtonStyle.Success).setDisabled(disabled),
            new ButtonBuilder().setCustomId(`${customIdPrefix}.stop`).setLabel('⏹️').setStyle(ButtonStyle.Danger).setDisabled(disabled),
        );
        return [ctrl];
    }
}
