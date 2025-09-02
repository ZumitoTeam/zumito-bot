import { Route, RouteMethod, ServiceContainer, TranslationManager } from "zumito-framework";
import { GameServerService } from "../services/GameServerService.js";
import { ServerListViewService } from "../services/ServerListViewService.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class GameServersIndex extends Route {
    method = RouteMethod.get;
    path = "/game-servers";

    constructor(
        private serverService: GameServerService = ServiceContainer.getService(GameServerService),
        private viewService: ServerListViewService = ServiceContainer.getService(ServerListViewService),
        private translationService: TranslationManager = ServiceContainer.getService(TranslationManager)
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const games = await this.serverService.getGames();
        const lang = req?.lang || "en";
        const title = this.translationService.get("index.title", lang) || "Game servers";
        const intro = this.translationService.get("index.intro", lang) || "Browse community game servers by game.";
        const noData = this.translationService.get("index.noData", lang) || "No games found yet.";

        const content = await ejs.renderFile(
            path.join(__dirname, "../views/server-landing.ejs"),
            { games, title, intro, noData }
        );
        const html = await this.viewService.render({ title, content });
        res.send(html);
    }
}
