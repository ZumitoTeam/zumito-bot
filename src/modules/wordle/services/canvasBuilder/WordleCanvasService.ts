import { ServiceContainer, TranslationManager } from "zumito-framework";
import { AttachmentBuilder, EmbedBuilder } from "zumito-framework/discord";
import { CanvasUtils } from "../../../utils/CanvasUtils.js";
import type { WordleState, LetterMark } from "../WordleService.js";
import { config } from "../../../../config/index.js";

export class WordleCanvasService {
    private translator: TranslationManager;

    constructor() {
        this.translator = ServiceContainer.getService(TranslationManager);
    }

    async render(state: WordleState, lang: string): Promise<{ embed: EmbedBuilder; file: AttachmentBuilder }> {
        const width = 400;
        const height = 400;
        const utils = new CanvasUtils({ width, height, format: 'image/png' });
        const ctx = utils.getContext();

        // Title
        const title = state.finished
            ? (state.won ? this.translator.get('wordle.win', lang) : this.translator.get('wordle.lose', lang, { answer: state.answer }))
            : this.translator.get('wordle.title', lang);
        utils.drawText(title, 20, 28, 'bold 22px Inter, Arial', '#FFFFFF');

        // Prompt (only when not finished)
        if (!state.finished) {
            const prompt = this.translator.get('wordle.prompt', lang);
            utils.drawText(prompt, 20, 50, '14px Inter, Arial', '#9CA3AF');
        }

        // Board drawing
        const top = 70;
        const left = 20;
        const cell = 50;
        const gap = 8;

        const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
            const radius = Math.min(r, w / 2, h / 2);
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + w, y, x + w, y + h, radius);
            ctx.arcTo(x + w, y + h, x, y + h, radius);
            ctx.arcTo(x, y + h, x, y, radius);
            ctx.arcTo(x, y, x + w, y, radius);
            ctx.closePath();
        };

        const drawCell = (x: number, y: number, mark: LetterMark | 'empty', ch?: string) => {
            let color = '#1F2937'; // empty border
            let fill = '#111827';
            if (mark === 'correct') { fill = '#16A34A'; color = '#16A34A'; }
            else if (mark === 'present') { fill = '#F59E0B'; color = '#F59E0B'; }
            else if (mark === 'absent') { fill = '#374151'; color = '#374151'; }

            ctx.fillStyle = fill;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            roundRect(x, y, cell, cell, 8);
            ctx.fill();
            ctx.stroke();

            if (ch) {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 22px Inter, Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(ch, x + cell / 2, y + cell / 2);
                ctx.textAlign = 'left';
                ctx.textBaseline = 'alphabetic';
            }
        };

        for (let r = 0; r < state.maxGuesses; r++) {
            const y = top + r * (cell + gap);
            for (let c = 0; c < 5; c++) {
                const x = left + c * (cell + gap);
                if (r < state.guesses.length) {
                    const guess = state.guesses[r];
                    const mark = state.marks[r][c];
                    drawCell(x, y, mark, guess[c]);
                } else if (r === state.guesses.length && state.current) {
                    const ch = state.current[c] || '';
                    drawCell(x, y, 'empty', ch);
                } else {
                    drawCell(x, y, 'empty');
                }
            }
        }

        const nonce = Date.now();
        const filename = `wordle-${nonce}.png`;
        const file = await utils.toAttachment(filename);

        const attempts = this.translator.get('wordle.attempts', lang, { used: state.guesses.length, max: state.maxGuesses });
        const embed = new EmbedBuilder()
            .setColor(config.colors.default)
            .setTitle(title)
            .setImage(`attachment://${filename}`)
            .setFooter({ text: attempts });

        return { embed, file };
    }
}
