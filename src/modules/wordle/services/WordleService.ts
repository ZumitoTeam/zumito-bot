export type LetterMark = 'correct' | 'present' | 'absent';

export interface WordleState {
    answer: string;
    guesses: string[];
    marks: LetterMark[][];
    current: string;
    maxGuesses: number;
    keyboard: Record<string, LetterMark>; // best-known mark per letter
    finished: boolean;
    won: boolean;
}

export class WordleService {
    private words: string[] = [
        'APPLE', 'GRAPE', 'MANGO', 'LEMON', 'BERRY', 'PEACH', 'CHILI', 'BREAD', 'WATER', 'HONEY',
        'ROBOT', 'SWORD', 'SHAPE', 'PLANT', 'METAL', 'PIXEL', 'SMART', 'PHONE', 'CLOUD', 'MOUSE'
    ];

    newGame(): WordleState {
        const answer = this.words[Math.floor(Math.random() * this.words.length)];
        return {
            answer,
            guesses: [],
            marks: [],
            current: '',
            maxGuesses: 6,
            keyboard: {},
            finished: false,
            won: false
        };
    }

    isValidGuess(guess: string): boolean {
        return /^[A-Z]{5}$/.test(guess);
    }

    submitGuess(state: WordleState, guess: string): void {
        if (state.finished) { return; }
        const upper = guess.toUpperCase();
        if (!this.isValidGuess(upper)) { throw new Error('invalid'); }
        const marks = this.score(upper, state.answer);
        state.guesses.push(upper);
        state.marks.push(marks);
        this.updateKeyboard(state, upper, marks);
        if (upper === state.answer) { state.finished = true; state.won = true; }
        else if (state.guesses.length >= state.maxGuesses) { state.finished = true; state.won = false; }
        state.current = '';
    }

    private score(guess: string, answer: string): LetterMark[] {
        const res: LetterMark[] = Array(5).fill('absent');
        const answerCounts: Record<string, number> = {};
        for (let i = 0; i < 5; i++) {
            const a = answer[i];
            answerCounts[a] = (answerCounts[a] || 0) + 1;
        }
        // First pass: correct positions
        for (let i = 0; i < 5; i++) {
            if (guess[i] === answer[i]) {
                res[i] = 'correct';
                answerCounts[guess[i]]!--;
            }
        }
        // Second pass: present letters
        for (let i = 0; i < 5; i++) {
            if (res[i] === 'correct') { continue; }
            const ch = guess[i];
            if ((answerCounts[ch] || 0) > 0) {
                res[i] = 'present';
                answerCounts[ch]!--;
            }
        }
        return res;
    }

    private updateKeyboard(state: WordleState, guess: string, marks: LetterMark[]): void {
        for (let i = 0; i < 5; i++) {
            const ch = guess[i];
            const mark = marks[i];
            const prev = state.keyboard[ch];
            // Upgrade precedence: absent < present < correct
            if (!prev || (prev === 'absent' && (mark === 'present' || mark === 'correct')) || (prev === 'present' && mark === 'correct')) {
                state.keyboard[ch] = mark;
            }
        }
    }

    renderBoard(state: WordleState): string {
        const emote = (m: LetterMark) => m === 'correct' ? '🟩' : (m === 'present' ? '🟨' : '⬛');
        const lines: string[] = [];
        for (let i = 0; i < state.maxGuesses; i++) {
            if (i < state.guesses.length) {
                const guess = state.guesses[i];
                const row = state.marks[i].map(emote).join('');
                lines.push(`${row}  ${guess}`);
            } else if (i === state.guesses.length && state.current) {
                const padded = (state.current + ' '.repeat(5 - state.current.length)).split('');
                lines.push(`⬜⬜⬜⬜⬜  ${padded.join('')}`);
            } else {
                lines.push('⬜⬜⬜⬜⬜');
            }
        }
        return '``' + '\n' + lines.join('\n') + '\n' + '```';
    }
}

