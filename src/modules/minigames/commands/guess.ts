import { Command, CommandParameters, CommandArgDefinition } from 'zumito-framework';

export class GuessCommand extends Command {
    name = 'guess';
    description = 'Guess a number between 1 and 10.';
    categories = ['minigames'];
    usage = 'guess <number>';
    args: CommandArgDefinition[] = [
        {
            name: 'number',
            type: 'number',
            optional: false,
        },
    ];

    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const guess = Number(args.get('number'));
        if (!Number.isInteger(guess) || guess < 1 || guess > 10) {
            const reply = 'Please choose a number between 1 and 10.';
            if (message) { await message.reply(reply); return; }
            if (interaction) { await interaction.reply(reply); return; }
            return;
        }
        const number = Math.floor(Math.random() * 10) + 1;
        const result = guess === number ? 'Correct!' : `Wrong, it was ${number}.`;
        const reply = `You guessed ${guess}. ${result}`;
        if (message) { await message.reply(reply); }
        if (interaction) { await interaction.reply(reply); }
    }
}
