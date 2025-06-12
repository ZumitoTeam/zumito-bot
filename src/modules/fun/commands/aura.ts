import { Command, CommandParameters, CommandType } from 'zumito-framework';
import { AuraEmbedBuilder } from '../embeds/AuraEmbedBuilder.ts';

export class Aura extends Command {
    type = CommandType.any;
    auraEmbedBuilder: AuraEmbedBuilder;

    constructor() {
        super();
        this.auraEmbedBuilder = new AuraEmbedBuilder();
    }

    async execute({ message, interaction, guildSettings }: CommandParameters): Promise<void> {
        const user = interaction?.user || message?.author!;
        const seedSource = user.id;
        const colors = ['red', 'blue', 'green', 'purple', 'yellow', 'pink', 'orange'];
        const elements = ['fire', 'water', 'air', 'earth', 'light', 'dark', 'spirit'];
        const descriptions = [
            'Your energy flows harmoniously.',
            'You are filled with passion and drive.',
            'A calm aura surrounds you.',
            'Your spirit blazes brightly.',
            'Mystic vibes follow you.',
        ];
        const rand = this.seededRandomString(seedSource);
        const color = colors[Math.floor(rand * colors.length)];
        const element = elements[Math.floor(rand * elements.length)];
        const desc = descriptions[Math.floor(rand * descriptions.length)];

        const embed = this.auraEmbedBuilder.getEmbed({
            color,
            element,
            description: desc,
            locale: guildSettings.locale,
        });
        (message || interaction)?.reply({
            embeds: [embed],
        });
    }

    hashStringToSeed(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash &= hash;
        }
        return hash;
    }

    randomWithSeed(seed: number): number {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    seededRandomString(str: string): number {
        const seed = this.hashStringToSeed(str);
        return this.randomWithSeed(seed);
    }
}
