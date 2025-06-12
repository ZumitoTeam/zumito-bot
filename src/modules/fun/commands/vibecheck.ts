import { Command, CommandParameters, CommandType } from 'zumito-framework';
import { VibeCheckEmbedBuilder } from '../embeds/VibeCheckEmbedBuilder.ts';

export class Vibecheck extends Command {
    type = CommandType.any;
    vibeCheckEmbedBuilder: VibeCheckEmbedBuilder;

    constructor() {
        super();
        this.vibeCheckEmbedBuilder = new VibeCheckEmbedBuilder();
    }

    async execute({ message, interaction, guildSettings }: CommandParameters): Promise<void> {
        const options = ['good', 'bad', 'cursed'] as const;
        const result = options[Math.floor(Math.random() * options.length)];

        const embed = this.vibeCheckEmbedBuilder.getEmbed({
            result,
            locale: guildSettings.locale,
        });
        (message || interaction)?.reply({
            embeds: [embed],
        });
    }
}
