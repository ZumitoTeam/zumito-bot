import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { ServiceContainer, ZumitoFramework } from "zumito-framework";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const DEFAULT_THEME = {
    primary: '#5865F2',
    secondary: '#36393f',
    accent: '#57F287',
    gradientFrom: '#23272A',
    gradientVia: '#36393f',
    gradientTo: '#5865F2',
    textMain: '#fff',
    textSecondary: '#fgf',
    background: '#1e2124'
};

export class LandingViewService {
    private static layoutPath = path.resolve(__dirname, '../views/layouts/landing.ejs');
    private theme: any;

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
                theme: (extra && extra.theme) || await this.getTheme()
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

    async getTheme(forceReload = false) {
        if (this.theme && !forceReload) return this.theme;
        const framework = ServiceContainer.hasService(ZumitoFramework) ? ServiceContainer.getService(ZumitoFramework) : null;
        let data: any = null;
        if (framework) {
            data = await framework.database.collection('landingtheme').findOne({ id: 'default' }).catch(() => null);
        }

        this.theme = {
            primary: data?.primary || process.env.LANDING_PRIMARY_COLOR || '#5865F2',
            secondary: data?.secondary || process.env.LANDING_SECONDARY_COLOR || '#36393f',
            accent: data?.accent || process.env.LANDING_ACCENT_COLOR || '#57F287',
            gradientFrom: data?.gradientFrom || process.env.LANDING_GRADIENT_FROM || '#23272A',
            gradientVia: data?.gradientVia || process.env.LANDING_GRADIENT_VIA || '#36393f',
            gradientTo: data?.gradientTo || process.env.LANDING_GRADIENT_TO || '#5865F2',
            textMain: data?.textMain || process.env.LANDING_TEXT_MAIN || '#fff',
            textSecondary: data?.textSecondary || process.env.LANDING_TEXT_SECONDARY || '#fgf',
            background: data?.background || process.env.LANDING_BACKGROUND || '#1e2124',
        };
        return this.theme;
    }
}

/*

return {
            primary: data?.primary || process.env.LANDING_PRIMARY_COLOR || '#e11d48',
            secondary: data?.secondary || process.env.LANDING_SECONDARY_COLOR || '#a78bfa',
            accent: data?.accent || process.env.LANDING_ACCENT_COLOR || '#f472b6',
            gradientFrom: data?.gradientFrom || process.env.LANDING_GRADIENT_FROM || '#e11d48',
            gradientVia: data?.gradientVia || process.env.LANDING_GRADIENT_VIA || '#f472b6',
            gradientTo: data?.gradientTo || process.env.LANDING_GRADIENT_TO || '#7dd3fc',
            textMain: data?.textMain || process.env.LANDING_TEXT_MAIN || '#222',
            textSecondary: data?.textSecondary || process.env.LANDING_TEXT_SECONDARY || '#444',
            background: data?.background || process.env.LANDING_BACKGROUND || '#fff',
        };
        */