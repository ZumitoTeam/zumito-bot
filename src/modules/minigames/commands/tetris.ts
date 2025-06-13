import { Command, CommandParameters, ButtonPressedParams } from 'zumito-framework';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, AnyComponentBuilder } from 'zumito-framework/discord';

type Point = [number, number];

interface Piece {
    rotations: Point[][];
    rotation: number;
    x: number;
    y: number;
}

interface GameState {
    board: number[][];
    piece: Piece;
    width: number;
    height: number;
    interval?: NodeJS.Timeout;
}

const pieces: Point[][][] = [
    // I
    [
        [[0, 1], [1, 1], [2, 1], [3, 1]],
        [[2, 0], [2, 1], [2, 2], [2, 3]],
        [[0, 2], [1, 2], [2, 2], [3, 2]],
        [[1, 0], [1, 1], [1, 2], [1, 3]],
    ],
    // O
    [
        [[1, 0], [2, 0], [1, 1], [2, 1]],
        [[1, 0], [2, 0], [1, 1], [2, 1]],
        [[1, 0], [2, 0], [1, 1], [2, 1]],
        [[1, 0], [2, 0], [1, 1], [2, 1]],
    ],
    // T
    [
        [[1, 0], [0, 1], [1, 1], [2, 1]],
        [[1, 0], [1, 1], [2, 1], [1, 2]],
        [[0, 1], [1, 1], [2, 1], [1, 2]],
        [[1, 0], [0, 1], [1, 1], [1, 2]],
    ],
];

const games = new Map<string, GameState>();

function createBoard(height: number, width: number): number[][] {
    return Array.from({ length: height }, () => Array(width).fill(0));
}

function spawnPiece(state: GameState): void {
    const type = Math.floor(Math.random() * pieces.length);
    const piece: Piece = {
        rotations: pieces[type],
        rotation: 0,
        x: 3,
        y: 0,
    };
    state.piece = piece;
}

function canMove(state: GameState, dx: number, dy: number, rot: number): boolean {
    const { rotations, x, y } = state.piece;
    const shape = rotations[(state.piece.rotation + rot + 4) % 4];
    for (const [px, py] of shape) {
        const nx = x + dx + px;
        const ny = y + dy + py;
        if (nx < 0 || nx >= state.width || ny >= state.height) { return false; }
        if (ny >= 0 && state.board[ny][nx]) { return false; }
    }
    return true;
}

function fixPiece(state: GameState): void {
    const { rotations, rotation, x, y } = state.piece;
    for (const [px, py] of rotations[rotation]) {
        const nx = x + px;
        const ny = y + py;
        if (ny >= 0) { state.board[ny][nx] = 1; }
    }
    clearLines(state);
    spawnPiece(state);
    if (!canMove(state, 0, 0, 0)) { state.interval && clearInterval(state.interval); }
}

function clearLines(state: GameState): void {
    state.board = state.board.filter(row => row.some(cell => !cell));
    while (state.board.length < state.height) { state.board.unshift(Array(state.width).fill(0)); }
}

function render(state: GameState): { content: string; components: AnyComponentBuilder[] } {
    const display = state.board.map(row => row.slice());
    const { rotations, rotation, x, y } = state.piece;
    for (const [px, py] of rotations[rotation]) {
        const nx = x + px;
        const ny = y + py;
        if (ny >= 0 && ny < state.height) { display[ny][nx] = 2; }
    }
    const lines = display.map(row => row.map(c => c ? '🟦' : '⬛').join('')).join('\n');
    const row: any = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('tetris.left').setLabel('⬅️').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('tetris.rotate').setLabel('⤴️').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('tetris.right').setLabel('➡️').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('tetris.drop').setLabel('⬇️').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('tetris.stop').setLabel('⏹️').setStyle(ButtonStyle.Danger),
    );
    return { content: '``' + '\n' + lines + '\n' + '```', components: [row] };
}

function step(state: GameState): void {
    if (canMove(state, 0, 1, 0)) { state.piece.y += 1; } else { fixPiece(state); }
}

function move(state: GameState, dx: number): void {
    if (canMove(state, dx, 0, 0)) { state.piece.x += dx; }
}

function rotate(state: GameState): void {
    if (canMove(state, 0, 0, 1)) { state.piece.rotation = (state.piece.rotation + 1) % 4; }
}

function drop(state: GameState): void {
    while (canMove(state, 0, 1, 0)) { state.piece.y += 1; }
    fixPiece(state);
}

export class TetrisCommand extends Command {
    name = 'tetris';
    description = 'Play a simple game of Tetris.';
    categories = ['minigames'];
    usage = 'tetris';

    async execute({ message, interaction }: CommandParameters): Promise<void> {
        const msg = message || interaction;
        if (!msg) { return; }
        const state: GameState = {
            board: createBoard(20, 10),
            piece: { rotations: [], rotation: 0, x: 0, y: 0 },
            width: 10,
            height: 20,
        };
        spawnPiece(state);
        const sent = message ? await message.reply(render(state)) : await interaction.reply({ ...render(state), fetchReply: true });
        state.interval = setInterval(async () => {
            step(state);
            await sent.edit(render(state));
        }, 1000);
        games.set(sent.id, state);
    }

    async buttonPressed({ path, interaction }: ButtonPressedParams): Promise<void> {
        const state = games.get(interaction.message.id);
        if (!state) { return; }
        if (path[1] === 'left') { move(state, -1); }
        else if (path[1] === 'right') { move(state, 1); }
        else if (path[1] === 'rotate') { rotate(state); }
        else if (path[1] === 'drop') { drop(state); }
        else if (path[1] === 'stop') { state.interval && clearInterval(state.interval); games.delete(interaction.message.id); await interaction.update({ content: 'Game over', components: [] }); return; }
        await interaction.update(render(state));
    }
}

