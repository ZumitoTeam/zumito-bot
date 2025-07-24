import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import ejs from 'ejs';
import { ZumitoFramework, Command } from "zumito-framework";
import { LandingViewService } from "../services/LandingViewService";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class Commands extends Route {
    method = RouteMethod.get;
    path = '/commands';

    framework: ZumitoFramework;

    constructor(
        private landingViewService: LandingViewService = ServiceContainer.getService(LandingViewService),
    ) {
        super();
        this.framework = ServiceContainer.getService(ZumitoFramework);
    }

    async execute(req, res) {
        // Obtener todos los comandos registrados
        const commands: Command[] = Array.from(this.framework.commands.getAll().values());
        // Agrupar por categoría
        const categories: Record<string, Command[]> = {};
        for (const cmd of commands) {
            for (const cat of cmd.categories || ["other"]) {
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push(cmd);
            }
        }
        // Obtener el theme para el layout
        const theme = await this.landingViewService.getTheme();
        // Renderizar la vista
        const content = await ejs.renderFile(
            path.join(__dirname, "../views/commands.ejs"),
            {
                categories,
                theme
            }
        );
        const html = await this.landingViewService.render({
            title: "Comandos",
            content,
            extra: { theme }
        });
        res.send(html);
    }
}
