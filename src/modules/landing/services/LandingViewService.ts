import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class LandingViewService {
    private static layoutPath = path.resolve(__dirname, '../views/layouts/landing.ejs');

    async render({
        title,
        content,
        extra = {}
    }: {
        title: string;
        content: string;
        extra?: Record<string, any>;
    }) {
        return await ejs.renderFile(
            LandingViewService.layoutPath,
            {
                title,
                content,
                ...extra,
                theme: (extra && extra.theme) || LandingViewService.getTheme()
            }
        );
    }

    /* static getTheme() {
        return {
            primary: process.env.LANDING_COLOR_PRIMARY || '#5865F2',
            secondary: process.env.LANDING_COLOR_SECONDARY || '#36393f',
            accent: process.env.LANDING_COLOR_ACCENT || '#57F287',
            gradientFrom: process.env.LANDING_GRADIENT_FROM || '#23272A',
            gradientVia: process.env.LANDING_GRADIENT_VIA || '#36393f',
            gradientTo: process.env.LANDING_GRADIENT_TO || '#5865F2',
            textMain: process.env.LANDING_TEXT_MAIN || '#fff',
            textSecondary: process.env.LANDING_TEXT_SECONDARY || '#fgf',
            background: process.env.LANDING_BACKGROUND || '#1e2124'
        };
    } */

    static getTheme() {
        return {
            primary: process.env.LANDING_PRIMARY_COLOR || '#e11d48',         // rose-600
            secondary: process.env.LANDING_SECONDARY_COLOR || '#a78bfa',     // purple-400
            accent: process.env.LANDING_ACCENT_COLOR || '#f472b6',           // pink-400
            gradientFrom: process.env.LANDING_GRADIENT_FROM || '#e11d48',    // rose-600
            gradientVia: process.env.LANDING_GRADIENT_VIA || '#f472b6',      // pink-400
            gradientTo: process.env.LANDING_GRADIENT_TO || '#7dd3fc',        // sky-300
            textMain: process.env.LANDING_TEXT_MAIN || '#222',
            textSecondary: process.env.LANDING_TEXT_SECONDARY || '#444',
            background: process.env.LANDING_BACKGROUND || '#fff', // white
        };
    }
}
