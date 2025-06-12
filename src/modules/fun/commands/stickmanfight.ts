import { Command, CommandParameters, CommandType, CommandArgDefinition } from 'zumito-framework';
import { AttachmentBuilder, EmbedBuilder, GuildMember, User } from 'zumito-framework/discord';
import { config } from '../../../config/index.js';

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
        const width = 500;
        const height = 300;
        const encoder = new GIFEncoder(width, height);
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(100); // Más rápido para mayor fluidez
        encoder.setQuality(10);

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const avatar1 = await loadImage(firstMember.user.displayAvatarURL({ extension: 'png', size: 64 }));
        const avatar2 = await loadImage(secondMember.user.displayAvatarURL({ extension: 'png', size: 64 }));

        // Función para dibujar el fondo
        const drawBackground = () => {
            // Gradiente de fondo
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#90EE90');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Suelo
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, height - 40, width, 40);
            
            // Líneas del suelo
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            for (let i = 0; i < width; i += 30) {
                ctx.beginPath();
                ctx.moveTo(i, height - 40);
                ctx.lineTo(i + 15, height);
                ctx.stroke();
            }
        };

        // Función para dibujar efectos de partículas
        const drawParticles = (x: number, y: number, color: string = '#FFD700') => {
            ctx.fillStyle = color;
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8;
                const px = x + Math.cos(angle) * (10 + Math.random() * 15);
                const py = y + Math.sin(angle) * (10 + Math.random() * 15);
                ctx.beginPath();
                ctx.arc(px, py, 2 + Math.random() * 3, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        // Función para dibujar stickman mejorado
        const drawStickman = (x: number, y: number, avatar: any, pose: string = 'normal', flip: boolean = false) => {
            ctx.save();
            if (flip) {
                ctx.scale(-1, 1);
                x = -x;
            }

            // Sombra
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(x, height - 30, 20, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Cabeza con avatar
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 4;
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatar, x - 20, y - 20, 40, 40);
            ctx.restore();

            // Contorno de cabeza
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.stroke();

            // Cuerpo y extremidades según pose
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';

            switch (pose) {
                case 'attack':
                    // Cuerpo inclinado hacia adelante
                    ctx.beginPath();
                    ctx.moveTo(x, y + 20);
                    ctx.lineTo(x + 5, y + 70);
                    ctx.stroke();
                    
                    // Brazo atacando
                    ctx.beginPath();
                    ctx.moveTo(x + 5, y + 35);
                    ctx.lineTo(x + 35, y + 25);
                    ctx.stroke();
                    
                    // Brazo trasero
                    ctx.beginPath();
                    ctx.moveTo(x + 5, y + 35);
                    ctx.lineTo(x - 15, y + 45);
                    ctx.stroke();
                    
                    // Piernas en posición de ataque
                    ctx.beginPath();
                    ctx.moveTo(x + 5, y + 70);
                    ctx.lineTo(x - 10, y + 120); // Ajustado para tocar más cerca del suelo
                    ctx.moveTo(x + 5, y + 70);
                    ctx.lineTo(x + 20, y + 120); // Ajustado para tocar más cerca del suelo
                    ctx.stroke();
                    break;

                case 'defend':
                    // Cuerpo normal
                    ctx.beginPath();
                    ctx.moveTo(x, y + 20);
                    ctx.lineTo(x, y + 70);
                    ctx.stroke();
                    
                    // Brazos defensivos
                    ctx.beginPath();
                    ctx.moveTo(x, y + 35);
                    ctx.lineTo(x - 25, y + 30);
                    ctx.moveTo(x, y + 35);
                    ctx.lineTo(x - 20, y + 50);
                    ctx.stroke();
                    
                    // Piernas normales
                    ctx.beginPath();
                    ctx.moveTo(x, y + 70);
                    ctx.lineTo(x - 15, y + 120); // Ajustado para tocar más cerca del suelo
                    ctx.moveTo(x, y + 70);
                    ctx.lineTo(x + 15, y + 120); // Ajustado para tocar más cerca del suelo
                    ctx.stroke();
                    break;

                case 'hit':
                    // Cuerpo inclinado hacia atrás
                    ctx.beginPath();
                    ctx.moveTo(x, y + 20);
                    ctx.lineTo(x - 10, y + 70);
                    ctx.stroke();
                    
                    // Brazos en shock
                    ctx.beginPath();
                    ctx.moveTo(x - 10, y + 35);
                    ctx.lineTo(x - 30, y + 20);
                    ctx.moveTo(x - 10, y + 35);
                    ctx.lineTo(x - 35, y + 45);
                    ctx.stroke();
                    
                    // Piernas tambaleantes
                    ctx.beginPath();
                    ctx.moveTo(x - 10, y + 70);
                    ctx.lineTo(x - 25, y + 120); // Ajustado para tocar más cerca del suelo
                    ctx.moveTo(x - 10, y + 70);
                    ctx.lineTo(x + 5, y + 120); // Ajustado para tocar más cerca del suelo
                    ctx.stroke();
                    break;

                case 'ko':
                    // Cuerpo en el suelo
                    ctx.beginPath();
                    ctx.moveTo(x - 25, y + 20);
                    ctx.lineTo(x + 25, y + 20);
                    ctx.stroke();
                    
                    // Brazos extendidos
                    ctx.beginPath();
                    ctx.moveTo(x - 15, y + 20);
                    ctx.lineTo(x - 35, y + 10);
                    ctx.moveTo(x + 15, y + 20);
                    ctx.lineTo(x + 35, y + 30);
                    ctx.stroke();
                    
                    // Piernas extendidas
                    ctx.beginPath();
                    ctx.moveTo(x - 10, y + 20);
                    ctx.lineTo(x - 20, y + 40);
                    ctx.moveTo(x + 10, y + 20);
                    ctx.lineTo(x + 20, y + 40);
                    ctx.stroke();
                    break;

                default: // normal
                    // Cuerpo normal
                    ctx.beginPath();
                    ctx.moveTo(x, y + 20);
                    ctx.lineTo(x, y + 70);
                    ctx.stroke();
                    
                    // Brazos normales
                    ctx.beginPath();
                    ctx.moveTo(x, y + 35);
                    ctx.lineTo(x - 20, y + 50);
                    ctx.moveTo(x, y + 35);
                    ctx.lineTo(x + 20, y + 50);
                    ctx.stroke();
                    
                    // Piernas normales
                    ctx.beginPath();
                    ctx.moveTo(x, y + 70);
                    ctx.lineTo(x - 15, y + 120); // Ajustado para tocar más cerca del suelo
                    ctx.moveTo(x, y + 70);
                    ctx.lineTo(x + 15, y + 120); // Ajustado para tocar más cerca del suelo
                    ctx.stroke();
            }
            
            ctx.restore();
        };

        const winner = Math.random() < 0.5 ? 'first' : 'second';

        // Frame 1-3: Personajes aparecen con tensión
        for (let i = 0; i < 3; i++) {
            drawBackground();
            drawStickman(100, 150, avatar1); // Más cerca del suelo (150 en lugar de 80)
            drawStickman(400, 150, avatar2, 'normal', true);
            
            // Texto de introducción con efecto parpadeante
            if (i % 2 === 0) {
                ctx.fillStyle = '#FF0000';
                ctx.font = 'bold 28px Arial';
                ctx.textAlign = 'center';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.strokeText('FIGHT!', width / 2, 50);
                ctx.fillText('FIGHT!', width / 2, 50);
            }
            
            encoder.addFrame(ctx);
        }

        // Frame 4-7: Se acercan gradualmente (más frames para fluidez)
        for (let i = 0; i < 4; i++) {
            drawBackground();
            const approach = i * 20;
            drawStickman(120 + approach, 150, avatar1);
            drawStickman(380 - approach, 150, avatar2, 'normal', true);
            encoder.addFrame(ctx);
        }

        // Frame 8-9: Pausa de tensión (se miran fijamente)
        for (let i = 0; i < 2; i++) {
            drawBackground();
            drawStickman(200, 150, avatar1);
            drawStickman(300, 150, avatar2, 'normal', true);
            
            // Efecto de tensión
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, width, height);
            
            encoder.addFrame(ctx);
        }

        // Frame 10-17: Secuencia de combate extendida (más frames)
        const combatSequence = [
            { p1: 'normal', p2: 'normal', effect: false },
            { p1: 'attack', p2: 'normal', effect: false },
            { p1: 'attack', p2: 'defend', effect: true },
            { p1: 'normal', p2: 'defend', effect: false },
            { p1: 'defend', p2: 'attack', effect: false },
            { p1: 'hit', p2: 'attack', effect: true },
            { p1: 'hit', p2: 'normal', effect: false },
            { p1: 'attack', p2: 'hit', effect: true }
        ];

        for (let i = 0; i < combatSequence.length; i++) {
            const seq = combatSequence[i];
            drawBackground();
            
            if (winner === 'first') {
                drawStickman(200, 150, avatar1, seq.p1);
                drawStickman(300, 150, avatar2, seq.p2, true);
                if (seq.effect) {
                    drawParticles(290, 150, '#FF6B6B');
                }
            } else {
                drawStickman(200, 150, avatar1, seq.p2);
                drawStickman(300, 150, avatar2, seq.p1, true);
                if (seq.effect) {
                    drawParticles(210, 150, '#FF6B6B');
                }
            }
            
            encoder.addFrame(ctx);
        }

        // Frame 18-20: Momento de pausa antes del KO (tensión máxima)
        for (let i = 0; i < 3; i++) {
            drawBackground();
            
            if (winner === 'first') {
                drawStickman(200, 150, avatar1, 'normal');
                drawStickman(300, 150, avatar2, 'hit', true);
            } else {
                drawStickman(200, 150, avatar1, 'hit');
                drawStickman(300, 150, avatar2, 'normal', true);
            }
            
            // Efecto de cámara lenta
            if (i === 1) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(0, 0, width, height);
            }
            
            encoder.addFrame(ctx);
        }

        // Frame 21-25: Resultado final con más drama
        for (let i = 0; i < 5; i++) {
            drawBackground();
            
            if (winner === 'first') {
                drawStickman(200, 150, avatar1, 'normal');
                drawStickman(300, 190, avatar2, 'ko', true); // Más cerca del suelo para el KO
                if (i < 3) drawParticles(300, 190, '#FFD700');
            } else {
                drawStickman(200, 190, avatar1, 'ko'); // Más cerca del suelo para el KO
                drawStickman(300, 150, avatar2, 'normal', true);
                if (i < 3) drawParticles(200, 190, '#FFD700');
            }
            
            // Texto KO con efecto
            if (i >= 1) {
                ctx.fillStyle = '#FF0000';
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 3;
                ctx.font = 'bold 40px Arial';
                ctx.textAlign = 'center';
                ctx.strokeText('K.O.!', width / 2, 220);
                ctx.fillText('K.O.!', width / 2, 220);
                
                // Efecto de victoria
                if (i >= 2) {
                    drawParticles(width / 2, 220, '#FFD700');
                }
            }
            
            encoder.addFrame(ctx);
        }

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
