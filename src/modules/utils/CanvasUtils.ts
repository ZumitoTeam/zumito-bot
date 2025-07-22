import { createCanvas, Canvas, CanvasRenderingContext2D, Image } from 'canvas';
import GIFEncoder from 'gifencoder';
import { AttachmentBuilder } from 'zumito-framework/discord';
import sharp from 'sharp';

interface CanvasConfig {
    width: number;
    height: number;
    isGif?: boolean; // New optional parameter
    delay?: number;
    quality?: number;
    repeat?: number;
    format?: 'image/png' | 'image/jpeg'; // For static images
}

export class CanvasUtils {
    private canvas: Canvas; // Use Canvas from 'canvas'
    private ctx: CanvasRenderingContext2D;
    private encoder: GIFEncoder | null = null; // Make optional
    private config: CanvasConfig;

    constructor(config: CanvasConfig) {
        this.config = {
            isGif: false, // Default to not a GIF
            delay: 100,
            quality: 10,
            repeat: 0,
            format: 'image/png', // Default format for static images
            ...config
        };
        this.canvas = createCanvas(this.config.width, this.config.height);
        this.ctx = this.canvas.getContext('2d');

        if (this.config.isGif) {
            this.encoder = new GIFEncoder(this.config.width, this.config.height);
            this.encoder.setRepeat(this.config.repeat);
            this.encoder.setDelay(this.config.delay);
            this.encoder.setQuality(this.config.quality);
        }
    }

    getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }

    getCanvas(): Canvas { // Use Canvas from 'canvas'
        return this.canvas;
    }

    startEncoder(): void {
        if (this.encoder) {
            this.encoder.start();
        }
    }

    addFrame(): void {
        if (this.encoder) {
            this.encoder.addFrame(this.ctx);
        } else {
            // For static images, adding a frame doesn't make sense in the same way.
            // Maybe a warning or throw an error if addFrame is called on a non-GIF canvas.
            console.warn("addFrame called on a non-GIF canvas. This operation is ignored.");
        }
    }

    async toAttachment(filename?: string): Promise<AttachmentBuilder> {
        let buffer: Buffer;
        let finalFilename = filename;

        if (this.encoder) {
            this.encoder.finish();
            buffer = this.encoder.out.getData();
            if (!finalFilename) finalFilename = 'image.gif'; // Default for GIF
        } else {
            // For static images, determine format and filename
            const format = this.config.format || 'image/png';
            buffer = this.canvas.toBuffer(format);
            if (!finalFilename) {
                const ext = format.split('/')[1];
                finalFilename = `image.${ext}`;
            }
        }
        return new AttachmentBuilder(buffer, { name: finalFilename });
    }

    // Generic drawing utilities (can be expanded)
    drawBackground(color1: string, color2: string): void {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.config.height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.config.width, this.config.height);
    }

    drawRect(x: number, y: number, width: number, height: number, color: string): void {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }

    drawText(text: string, x: number, y: number, font: string, color: string, align: CanvasTextAlign = 'left'): void {
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.fillText(text, x, y);
    }

    drawParticles(x: number, y: number, color: string = '#FFD700'): void {
        this.ctx.fillStyle = color;
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const px = x + Math.cos(angle) * (10 + Math.random() * 15);
            const py = y + Math.sin(angle) * (10 + Math.random() * 15);
            this.ctx.beginPath();
            this.ctx.arc(px, py, 2 + Math.random() * 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // Utility to load images
    static async loadImage(src: string): Promise<Image> {
        try {
            const response = await fetch(src);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const imgBuffer = await sharp(Buffer.from(arrayBuffer)).toFormat('png').toBuffer();
            const { loadImage } = await import('canvas');
            return loadImage(imgBuffer);
        } catch (error) {
            console.error("Error loading image with Sharp:", error);
            throw error; // Re-throw the error to be caught by the command
        }
    }
}
