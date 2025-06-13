import { Command, CommandParameters, CommandArgDefinition } from 'zumito-framework';

export class RpsCommand extends Command {
    name = 'rps';
    description = 'Play rock paper scissors with the bot.';
    categories = ['minigames'];
    usage = 'rps <rock|paper|scissors>';
    args: CommandArgDefinition[] = [
        {
            name: 'choice',
            type: 'string',
            optional: false,
            choices: [
                { name: 'rock', value: 'rock' },
                { name: 'paper', value: 'paper' },
                { name: 'scissors', value: 'scissors' },
            ],
        },
    ];

    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const userChoice = String(args.get('choice')).toLowerCase();
        if (!['rock', 'paper', 'scissors'].includes(userChoice)) {
            const reply = "Choose 'rock', 'paper' or 'scissors'.";
            if (message) { await message.reply(reply); return; }
            if (interaction) { await interaction.reply(reply); return; }
            return;
        }
        const options = ['rock', 'paper', 'scissors'];
        const botChoice = options[Math.floor(Math.random() * options.length)];
        let result = '';
        if (userChoice === botChoice) {
            result = "It's a draw!";
        } else if (
            (userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = 'You win!';
        } else {
            result = 'You lose!';
        }
        const reply = `You chose **${userChoice}**, I chose **${botChoice}**. ${result}`;
        if (message) { await message.reply(reply); }
        if (interaction) { await interaction.reply(reply); }
    }
}
