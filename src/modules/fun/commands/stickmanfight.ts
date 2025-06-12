import { Command, CommandParameters, CommandType, CommandArgDefinition } from 'zumito-framework';
import { AttachmentBuilder, EmbedBuilder, GuildMember, User } from 'zumito-framework/discord';
import { config } from '../../config/index.js';

export class Stickmanfight extends Command {
    type = CommandType.any;
    args: CommandArgDefinition[] = [
        { name: 'user1', type: 'user', optional: true },
        { name: 'user2', type: 'user', optional: true },
    ];

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const guild = message?.guild || interaction?.guild;
        if (!guild) return;
        const members = guild.members.cache.filter(m => !m.user.bot).map(m => m as GuildMember);
        if (members.length < 2) {
            (message || interaction!)?.reply({ content: 'Not enough members', ephemeral: true });
            return;
        }
        const first = args.get('user1') as User | undefined;
        const second = args.get('user2') as User | undefined;

        const getRandomMember = (excludeId?: string): GuildMember => {
            const filtered = excludeId ? members.filter(m => m.id !== excludeId) : members;
            return filtered[Math.floor(Math.random() * filtered.length)];
        };

        const firstMember = first ? (guild.members.cache.get(first.id) as GuildMember) : getRandomMember();
        const secondMember = second ? (guild.members.cache.get(second.id) as GuildMember) : getRandomMember(firstMember.id);

        const { createCanvas, loadImage } = await import('canvas');
        const GIF = await import('gifencoder');
        const GIFEncoder = (GIF as any).default || (GIF as any);
        const width = 400;
        const height = 200;
        const encoder = new GIFEncoder(width, height);
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(200);
        encoder.setQuality(10);

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const avatar1 = await loadImage(firstMember.user.displayAvatarURL({ extension: 'png', size: 64 }));
        const avatar2 = await loadImage(secondMember.user.displayAvatarURL({ extension: 'png', size: 64 }));

        const drawStickman = (x: number, y: number, avatar: any, lying = false) => {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, x - 15, y - 15, 30, 30);
            ctx.restore();

            if (lying) {
                ctx.beginPath();
                ctx.moveTo(x - 20, y + 15);
                ctx.lineTo(x + 20, y + 15);
                ctx.stroke();
                return;
            }

            ctx.beginPath();
            ctx.moveTo(x, y + 15);
            ctx.lineTo(x, y + 55);
            ctx.moveTo(x, y + 25);
            ctx.lineTo(x - 15, y + 40);
            ctx.moveTo(x, y + 25);
            ctx.lineTo(x + 15, y + 40);
            ctx.moveTo(x, y + 55);
            ctx.lineTo(x - 15, y + 80);
            ctx.moveTo(x, y + 55);
            ctx.lineTo(x + 15, y + 80);
            ctx.stroke();
        };

        const winner = Math.random() < 0.5 ? 'first' : 'second';

        for (let i = 0; i < 6; i++) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, width, height);
            const x1 = 60 + i * 25;
            const x2 = 340 - i * 25;
            drawStickman(x1, 50, avatar1);
            drawStickman(x2, 50, avatar2);
            if (i === 2) {
                ctx.fillStyle = '#ff0000';
                ctx.font = '20px sans-serif';
                ctx.fillText('VS', 190, 90);
            }
            encoder.addFrame(ctx);
        }

        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);
        if (winner === 'first') {
            drawStickman(180, 50, avatar1);
            drawStickman(220, 50, avatar2, true);
        } else {
            drawStickman(180, 50, avatar1, true);
            drawStickman(220, 50, avatar2);
        }
        ctx.fillStyle = '#ff0000';
        ctx.font = '20px sans-serif';
        ctx.fillText('KO!', 190, 90);
        encoder.addFrame(ctx);

        encoder.finish();
        const buffer = Buffer.from(encoder.out.getData());
        const attachment = new AttachmentBuilder(buffer, { name: 'stickmanfight.gif' });

        const embed = new EmbedBuilder()
            .setDescription(trans('result', {
                user1: firstMember.user.globalName || firstMember.user.username,
                user2: secondMember.user.globalName || secondMember.user.username,
                winner: winner === 'first'
                    ? (firstMember.user.globalName || firstMember.user.username)
                    : (secondMember.user.globalName || secondMember.user.username),
            }))
            .setColor(config.colors.default)
            .setImage('attachment://stickmanfight.gif');

        (message || interaction!)?.reply({ embeds: [embed], files: [attachment] });
    }
}
