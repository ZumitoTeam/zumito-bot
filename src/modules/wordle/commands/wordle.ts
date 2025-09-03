import { Command, CommandBinds, CommandParameters, ButtonPressedParams, ModalSubmitParameters, ServiceContainer, TranslationManager } from 'zumito-framework';
import { AnyComponentBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } from 'zumito-framework/discord';
import { WordleService, WordleState } from '../services/WordleService.js';
import { WordleButtonsService } from '../services/buttonBuilder/WordleButtonsService.js';
import { WordleCanvasService } from '../services/canvasBuilder/WordleCanvasService.js';

interface GameSession { state: WordleState; channelId: string; }
const games = new Map<string, GameSession>(); // key: messageId

export class WordleCommand extends Command {
    name = 'wordle';
    categories = ['minigames'];
    description = 'Play a Wordle-like game in Discord';

    private wordle: WordleService;
    private buttons: WordleButtonsService;
    private canvas: WordleCanvasService;
    private translator: TranslationManager;

    constructor() {
        super();
        this.wordle = ServiceContainer.getService(WordleService);
        this.buttons = ServiceContainer.getService(WordleButtonsService);
        this.canvas = ServiceContainer.getService(WordleCanvasService);
        this.translator = ServiceContainer.getService(TranslationManager);
        this.binds = { modalSubmit: this.modalSubmit.bind(this) };
    }

    binds: CommandBinds;

    async execute({ message, interaction, trans, guildSettings }: CommandParameters): Promise<void> {
        const msg = message || interaction;
        if (!msg) { return; }
        const state = this.wordle.newGame();
        const content = this.renderContent(state, trans);
        const lang = (guildSettings?.lang) || (message as any)?.guild?.preferredLocale || (interaction as any)?.guild?.preferredLocale || 'en';
        const { embed, file } = await this.canvas.render(state, lang);
        const components = this.buttons.buildControls('wordle');
        if (message) {
            const sent = await message.reply({ embeds: [embed], files: [file], components });
            games.set(sent.id, { state, channelId: message.channel.id });
        } else if (interaction) {
            await interaction.reply({ embeds: [embed], files: [file], components });
            const sent = await interaction.fetchReply();
            games.set((sent as any).id, { state, channelId: interaction.channelId! });
        }
    }

    async buttonPressed({ path, interaction, guildSettings }: ButtonPressedParams): Promise<void> {
        if (path[0] !== 'wordle') { return; }
        const session = games.get(interaction.message.id);
        if (!session) { return; }
        const state = session.state;
        const action = path[1];
        if (action === 'enter') {
            // Open modal to capture guess
            if (state.finished) { return; }
            const lang = guildSettings?.lang || 'en';
            const modal = new ModalBuilder()
                .setCustomId(`wordle.guess.${interaction.message.id}`)
                .setTitle(this.translator.get('wordle.modalTitle', lang));
            const input = new TextInputBuilder()
                .setCustomId('guess')
                .setLabel(this.translator.get('wordle.inputLabel', lang))
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(5)
                .setMinLength(5);
            const row: any = new ActionRowBuilder<TextInputBuilder>().addComponents(input);
            modal.addComponents(row);
            await interaction.showModal(modal);
            return;
        } else if (action === 'stop') {
            state.finished = true;
        }
        const lang = guildSettings?.lang || 'en';
        const trans = (key: string, params?: Record<string, any>) => this.translator.get(key, lang, params);
        const content = this.renderContent(state, trans);
        const { embed, file } = await this.canvas.render(state, lang);
        const components: AnyComponentBuilder[] = this.buttons.buildControls('wordle', state.finished);
        if (state.finished) { games.delete(interaction.message.id); }
        try {
            await interaction.update({ embeds: [embed], files: [file], components, attachments: [] });
        } catch {
            // Fallback to direct message edit if component update cannot refresh attachment
            const channel = interaction.channelId === session.channelId
                ? interaction.channel!
                : await interaction.client.channels.fetch(session.channelId) as any;
            const msg = await (channel as any).messages.fetch(interaction.message.id);
            await msg.edit({ embeds: [embed], files: [file], components, attachments: [] });
        }
    }

    async modalSubmit({ interaction, path, trans }: ModalSubmitParameters): Promise<void> {
        if (path[0] !== 'wordle' || path[1] !== 'guess') return;
        const messageId = path[2];
        const session = games.get(messageId);
        if (!session) { await interaction.reply({ content: 'Game not found', flags: MessageFlags.Ephemeral }); return; }
        const state = session.state;
        const guessRaw = interaction.fields.getTextInputValue('guess');
        const guess = (guessRaw || '').toUpperCase();
        if (guess.length !== 5 || !/^[A-Z]{5}$/.test(guess)) {
            await interaction.reply({ content: trans('wordle.mustBeFive'), flags: MessageFlags.Ephemeral });
            return;
        }
        try {
            this.wordle.submitGuess(state, guess);
        } catch (e){
            await interaction.reply({ content: trans('wordle.invalidWord'), flags: MessageFlags.Ephemeral });
throw e;
            return;
        }

        // Edit the original game message (surface errors if any)
        const content = this.renderContent(state, trans);
        const { embed, file } = await this.canvas.render(state, (interaction as any)?.guild?.preferredLocale || 'en');
        const components: AnyComponentBuilder[] = this.buttons.buildControls('wordle', state.finished);
        const channel = interaction.channelId === session.channelId
            ? interaction.channel!
            : await interaction.client.channels.fetch(session.channelId) as any;
        const msg = await (channel as any).messages.fetch(messageId);
        // Try to edit first; fallback to delete/send if edit fails
        try {
            await msg.edit({ embeds: [embed], files: [file], components, attachments: [] });
        } catch {
            await msg.delete().catch(() => {});
            const newMsg = await (channel as any).send({ embeds: [embed], files: [file], components });
            games.delete(messageId);
            games.set(newMsg.id, { state, channelId: session.channelId });
        }

        if (state.finished) { games.delete(messageId); }
        await interaction.reply({ content: state.finished ? (state.won ? trans('wordle.win') : trans('wordle.lose', { answer: state.answer })) : trans('wordle.prompt'), flags: MessageFlags.Ephemeral });
    }

    private renderContent(state: WordleState, trans: (key: string, params?: Record<string, any>) => string): string {
        const header = state.finished
            ? (state.won ? trans('wordle.win') : trans('wordle.lose', { answer: state.answer }))
            : trans('wordle.prompt');
        const board = this.wordle.renderBoard(state);
        const attempts = trans('wordle.attempts', { used: state.guesses.length, max: state.maxGuesses });
        return `${header}\n${board}\n${attempts}`;
    }

    // No longer needed: embed is drawn via canvas
}
