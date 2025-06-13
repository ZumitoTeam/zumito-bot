import { Command, CommandParameters } from 'zumito-framework';

export class DiceCommand extends Command {
    name = 'dice';
    description = 'Roll a six-sided dice.';
    categories = ['minigames'];
    usage = 'dice';

    async execute({ message, interaction }: CommandParameters): Promise<void> {
        const roll = Math.floor(Math.random() * 6) + 1;
        const reply = `You rolled a **${roll}**.`;
        if (message) { await message.reply(reply); }
        if (interaction) { await interaction.reply(reply); }
    }
}
