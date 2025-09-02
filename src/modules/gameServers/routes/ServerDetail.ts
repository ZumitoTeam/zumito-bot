import { Route, RouteMethod, ServiceContainer, TranslationManager } from "zumito-framework";
import { GameServerService } from "../services/GameServerService.js";
import { ServerListViewService } from "../services/ServerListViewService.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ServerDetail extends Route {
    method = RouteMethod.get;
    path = "/game-servers/:game/:id";

    constructor(
        private serverService: GameServerService = ServiceContainer.getService(GameServerService),
        private viewService: ServerListViewService = ServiceContainer.getService(ServerListViewService),
        private translationService: TranslationManager = ServiceContainer.getService(TranslationManager)
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const game = String(req.params.game).toLowerCase();
        const id = String(req.params.id);
        const lang = req?.lang || "en";

        const server = await this.serverService.getServerById(id);
        if (!server || (server.game || '').toLowerCase() !== game) {
            res.status(404).send("Not found");
            return;
        }

        const status = await this.serverService.getDetailedStatus(server);

        const pageTitle = this.translationService.get('server.title', lang, { name: server.name }) || `${server.name} — server details`;
        const tGame = this.translationService.get('server.game', lang) || 'Game';
        const tIp = this.translationService.get('server.ip', lang) || 'IP';
        const tStatus = this.translationService.get('server.status', lang) || 'Status';
        const tPlayers = this.translationService.get('server.players', lang) || 'Players';
        const tVersion = this.translationService.get('server.version', lang) || 'Version';
        const tMotd = this.translationService.get('server.motd', lang) || 'MOTD';
        const tCopy = this.translationService.get('server.copyIp', lang) || 'Copy IP';
        const tCopied = this.translationService.get('server.copied', lang) || 'Copied!';
        const tBack = this.translationService.get('server.back', lang, { game }) || `Back to ${game} servers`;
        const labelOnline = this.translationService.get('server.online', lang) || 'Online';
        const labelOffline = this.translationService.get('server.offline', lang) || 'Offline';

        const content = await ejs.renderFile(
            path.join(__dirname, '../views/server-detail.ejs'),
            {
                server,
                status,
                game,
                pageTitle,
                tGame,
                tIp,
                tStatus,
                tPlayers,
                tVersion,
                tMotd,
                tCopy,
                tCopied,
                tBack,
                labelOnline,
                labelOffline
            }
        );
        const html = await this.viewService.render({ title: pageTitle, content });
        res.send(html);
    }
}

