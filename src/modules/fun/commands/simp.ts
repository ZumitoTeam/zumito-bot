import { Command, CommandParameters, CommandType } from 'zumito-framework';
import { EmbedBuilder } from 'zumito-framework/discord';
import { config } from '../../../config/index.js';

export class Simp extends Command {
    type = CommandType.any;

    async execute({ message, interaction, guildSettings, trans }: CommandParameters): Promise<void> {
        const channel = message?.channel || interaction?.channel;
        const authorId = message?.author?.id || interaction?.user?.id;

        if (!channel || !('messages' in channel) || !authorId) return;

        const fetched = await channel.messages.fetch({ limit: 100 }).catch(() => null);
        if (!fetched) return;

        const counts: Record<string, number> = {};
        fetched.forEach(msg => {
            if (msg.author.id !== authorId) return;
            msg.mentions.users.forEach(user => {
                if (user.bot || user.id === authorId) return;
                counts[user.id] = (counts[user.id] || 0) + 1;
            });
        });

        let topUserId: string | null = null;
        let max = 0;
        for (const [id, count] of Object.entries(counts)) {
            if (count > max) {
                max = count;
                topUserId = id;
            }
        }

        if (!topUserId) {
            (message || interaction!)?.reply({ content: trans('none'), ephemeral: true });
            return;
        }

        const member = await channel.guild.members.fetch(topUserId).catch(() => null);
        const display = member?.user?.globalName || member?.user?.username || 'Unknown';

        const embed = new EmbedBuilder()
            .setDescription(trans('result', { user: display }))
            .setColor(config.colors.default);

        (message || interaction!)?.reply({ embeds: [embed] });
    }
}
