import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { GameServerService } from "../services/GameServerService.js";
import { ServerListViewService } from "../services/ServerListViewService.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class GameLanding extends Route {
    method = RouteMethod.get;
    path = '/game-servers';

    constructor(
        private serverService: GameServerService = ServiceContainer.getService(GameServerService),
        private viewService: ServerListViewService = ServiceContainer.getService(ServerListViewService)
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const games = await this.serverService.getGames();
        const content = await ejs.renderFile(
            path.join(__dirname, '../views/game-landing.ejs'),
            { games }
        );
        const html = await this.viewService.render({ title: 'Game servers', content });
        res.send(html);
    }
}
