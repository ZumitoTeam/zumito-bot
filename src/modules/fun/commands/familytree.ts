import { Command, CommandArgDefinition, CommandParameters, CommandType } from 'zumito-framework';
import { AttachmentBuilder, User, GuildMember } from 'zumito-framework/discord';
import { config } from '../../../config/index.js';

export class Familytree extends Command {
    type = CommandType.any;
    args: CommandArgDefinition[] = [{ name: 'user', type: 'user', optional: true }];

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const channel = message?.channel || interaction?.channel;
        const guild = message?.guild || interaction?.guild;
        if (!channel || !guild || !('messages' in channel)) return;

        const target = (args.get('user') as User) || interaction?.user || message?.author!;
        const fetched = await channel.messages.fetch({ limit: 50 }).catch(() => null);
        if (!fetched) return;

        const counts: Record<string, number> = {};
        fetched.forEach(msg => {
            if (msg.author.id !== target.id) return;
            msg.mentions.users.forEach(u => {
                if (u.bot || u.id === target.id) return;
                counts[u.id] = (counts[u.id] || 0) + 1;
            });
        });

        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
        const members: (GuildMember | null)[] = await Promise.all(sorted.map(([id]) => guild.members.fetch(id).catch(() => null)));

        const { createCanvas, loadImage } = await import('canvas');
        const width = 500;
        const height = 250;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;

        const rootAvatar = await loadImage(target.displayAvatarURL({ extension: 'png', size: 64 }));
        const rootX = width / 2;
        const rootY = 60;
        ctx.save();
        ctx.beginPath();
        ctx.arc(rootX, rootY, 30, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(rootAvatar, rootX - 30, rootY - 30, 60, 60);
        ctx.restore();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.font = '16px sans-serif';
        ctx.fillText(target.globalName || target.username, rootX, rootY + 50);

        const startX = width / (members.length + 1);
        for (const [index, member] of members.entries()) {
            if (!member) continue;
            const x = startX * (index + 1);
            const y = 180;
            ctx.beginPath();
            ctx.moveTo(rootX, rootY + 30);
            ctx.lineTo(x, y - 30);
            ctx.stroke();

            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'png', size: 64 }));
            ctx.drawImage(avatar, x - 30, y - 30, 60, 60);
            ctx.restore();
            ctx.fillText(member.user.globalName || member.user.username, x, y + 50);
        }

        const buffer = canvas.toBuffer();
        const attachment = new AttachmentBuilder(buffer, { name: 'familytree.png' });
        const embed = new (await import('zumito-framework/discord')).EmbedBuilder()
            .setDescription(trans('result', { user: target.globalName || target.username }))
            .setColor(config.colors.default)
            .setImage('attachment://familytree.png');

        (message || interaction!)?.reply({ embeds: [embed], files: [attachment] });
    }
}
