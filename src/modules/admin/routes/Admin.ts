import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import ejs from 'ejs';
import { Client, version as discordjsVersion } from "zumito-framework/discord";
import { AdminViewService } from "../services/AdminViewService";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class Admin extends Route {

    method = RouteMethod.get;
    path = '/admin';

    client: Client;

    constructor() {
        super();
        this.client = ServiceContainer.getService(Client);
    }

    async execute(req, res) {
        if (!this.isLoginValid(req, res)) return res.redirect('/admin/test');

        const client = this.client;
        const botUser = client.user;
        const botAvatar = botUser?.avatarURL?.() || botUser?.displayAvatarURL?.() || '';
        const botName = botUser?.username || 'Zumito';
        const botId = botUser?.id || '';
        // Estado del bot: intenta obtenerlo de la primera guild disponible
        let botStatus = 'offline';
        const firstGuild = client.guilds.cache.first();
        if (firstGuild) {
            const me = firstGuild.members?.me;
            if (me && me.presence) {
                botStatus = me.presence.status;
            }
        }
        const botUptime = client.uptime ? msToTime(client.uptime) : '';
        const botUsers = client.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);
        const botChannels = client.channels?.cache?.size || 0;
        const nodeVersion = process.version;
        const botCreatedAt = botUser?.createdAt ? botUser.createdAt.toLocaleString() : '';
        function msToTime(duration: number) {
            let seconds = Math.floor((duration / 1000) % 60),
                minutes = Math.floor((duration / (1000 * 60)) % 60),
                hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
                days = Math.floor(duration / (1000 * 60 * 60 * 24));
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        const content = await ejs.renderFile(
            path.resolve(__dirname, '../views/dashboard.ejs'),
            { 
                servers: client.guilds.cache.size,
                botName,
                botId,
                botAvatar,
                botStatus,
                botUptime,
                botUsers,
                botChannels,
                nodeVersion,
                discordjsVersion,
                botCreatedAt,
            }
        );

        const adminView = new AdminViewService();
        const html = await adminView.render({
            title: 'Dashboard',
            content,
            reqPath: this.path,
            user: { name: 'Admin' }
        });

        res.send(html)
    }

    isLoginValid(req, res) {
        return true;
        const token = req.cookies.token;
        if (!token) return false;
        const jwt = JSON.parse(Buffer.from(token, 'base64').toString());
        const now = Math.floor(Date.now() / 1000);
        return now < jwt.expires_in;
    }
}