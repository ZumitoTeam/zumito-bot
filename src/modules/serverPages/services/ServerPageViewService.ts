import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

export class ServerPageViewService {
    private static layoutPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../views/layouts/server-landing.ejs');

    async render({
        title,
        content,
        extra = {}
    }: {
        title: string;
        content: string;
        extra?: Record<string, any>;
    }): Promise<string> {
        return await ejs.renderFile(
            ServerPageViewService.layoutPath,
            {
                title,
                content,
                ...extra,
                theme: (extra && extra.theme) || ServerPageViewService.getTheme()
            }
        );
    }

    static getTheme() {
        return {
            primary: process.env.SERVER_LANDING_COLOR_PRIMARY || '#5865F2',
            secondary: process.env.SERVER_LANDING_COLOR_SECONDARY || '#36393f',
            accent: process.env.SERVER_LANDING_COLOR_ACCENT || '#57F287'
        };
    }
}
