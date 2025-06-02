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
                ...extra
            }
        );
    }

    static getTheme() {
        return {
            primary: process.env.LANDING_COLOR_PRIMARY || '#5865F2',
            secondary: process.env.LANDING_COLOR_SECONDARY || '#36393f',
            accent: process.env.LANDING_COLOR_ACCENT || '#57F287',
            gradientFrom: process.env.LANDING_GRADIENT_FROM || '#23272A',
            gradientVia: process.env.LANDING_GRADIENT_VIA || '#36393f',
            gradientTo: process.env.LANDING_GRADIENT_TO || '#5865F2',
        };
    }
}
