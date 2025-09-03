import sharp from 'sharp';

export class BlurService {
    async blur(input: Buffer, intensity: number = 12): Promise<Buffer> {
        const sigma = Math.max(0.3, Math.min(100, Number(intensity) || 12));
        // Output PNG to keep consistent
        return await sharp(input).blur(sigma).png().toBuffer();
    }
}

