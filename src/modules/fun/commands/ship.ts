import { GuildMember, User, EmbedBuilder } from "zumito-framework/discord";
import { Command, CommandParameters, CommandType, CommandArgDefinition } from "zumito-framework";
import { config } from "../../config/index.js";

export class Ship extends Command {
    args: CommandArgDefinition[] = [
        { name: 'user1', type: 'user', optional: true },
        { name: 'user2', type: 'user', optional: true }
    ];
    type = CommandType.any;
    async execute({ message, interaction, args, guildSettings, trans }: CommandParameters): Promise<void> {
        const guild = message?.guild || interaction?.guild;
        if (!guild) return;
        const members = guild.members.cache.filter(m => !m.user.bot).map(m => m as GuildMember);
        if (members.length < 2) {
            (message || interaction!)?.reply({ content: 'Not enough members', ephemeral: true });
            return;
        }
        let first = args.get('user1') as User | undefined;
        let second = args.get('user2') as User | undefined;

        const getRandomMember = (excludeId?: string): GuildMember => {
            const filtered = excludeId ? members.filter(m => m.id !== excludeId) : members;
            return filtered[Math.floor(Math.random() * filtered.length)];
        };

        const firstMember = first ? (guild.members.cache.get(first.id) as GuildMember) : getRandomMember();
        const secondMember = second ? (guild.members.cache.get(second.id) as GuildMember) : getRandomMember(firstMember.id);

        const pair = [firstMember.id, secondMember.id].sort().join(':');
        const percent = Math.floor(this.seededRandomString(pair) * 101);
        const embed = new EmbedBuilder()
            .setDescription(trans('result', {
                user1: firstMember.user.globalName || firstMember.user.username,
                user2: secondMember.user.globalName || secondMember.user.username,
                percent: percent
            }))
            .setColor(config.colors.default);
        (message || interaction!)?.reply({ embeds: [embed] });
    }

    hashStringToSeed(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        return hash;
    }

    randomWithSeed(seed: number): number {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    seededRandomString(str: string): number {
        const seed = this.hashStringToSeed(str);
        return this.randomWithSeed(seed);
    }
}
