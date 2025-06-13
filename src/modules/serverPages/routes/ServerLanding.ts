import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { Client } from "zumito-framework/discord";
import { ServerPageViewService } from "../services/ServerPageViewService";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ServerLanding extends Route {
    method = RouteMethod.get;
    path = '/server/:guildId';

    constructor(private client: Client = ServiceContainer.getService(Client)) {
        super();
    }

    async execute(req: any, res: any) {
        const guildId = req.params.guildId as string;
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return res.status(404).send('Servidor no encontrado');

        const tagline = process.env.SERVER_LANDING_TAGLINE || 'Bienvenido a nuestro servidor!';
        const inviteUrl = process.env.SERVER_LANDING_INVITE || guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : `https://discord.com/oauth2/authorize?client_id=${this.client.user?.id}&scope=bot+applications.commands&guild_id=${guildId}`;

        const theme = ServerPageViewService.getTheme();

        const content = await ejs.renderFile(
            path.join(__dirname, '../views/server-landing.ejs'),
            { guild, tagline, inviteUrl, theme }
        );

        const view = new ServerPageViewService();
        const html = await view.render({ title: guild.name, content, extra: { theme } });
        res.send(html);
    }
}
