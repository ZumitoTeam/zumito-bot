import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { GameServerService } from "../services/GameServerService.js";
import { ServerListViewService } from "../services/ServerListViewService.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ServerLanding extends Route {
    method = RouteMethod.get;
    path = '/servers/:game';

    constructor(
        private serverService: GameServerService = ServiceContainer.getService(GameServerService),
        private viewService: ServerListViewService = ServiceContainer.getService(ServerListViewService)
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const game = String(req.params.game).toLowerCase();
        const servers = await this.serverService.getServers(game);
        const list = [];
        for (const server of servers) {
            const status = await this.serverService.getStatus(server);
            list.push({ ...server, status });
        }
        const content = await ejs.renderFile(
            path.join(__dirname, '../views/server-list.ejs'),
            { servers: list, game }
        );
        const html = await this.viewService.render({ title: `${game} servers`, content });
        res.send(html);
    }
}
