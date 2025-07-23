import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { Client, PermissionFlagsBits } from "zumito-framework/discord";
import { UserPanelAuthService } from "../services/UserPanelAuthService";
import { UserPanelViewService } from "../services/UserPanelViewService";
import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class UserPanelTicket extends Route {
    method = RouteMethod.get;
    path = '/panel/:guildId(\\d+)/ticket';

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private auth = ServiceContainer.getService(UserPanelAuthService),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) {
            return res.redirect('/panel/login');
        }

        const userId = authData.data.discordUserData.id;
        const guildId = req.params.guildId as string;
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return res.status(404).send('Servidor no encontrado');

        let member = guild.members.cache.get(userId);
        if (!member) {
            member = await guild.members.fetch(userId).catch(() => null);
        }
        if (!member || !(member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ManageGuild) || guild.ownerId === userId)) {
            return res.status(403).send('No tienes permisos en este servidor');
        }
        const ticketsCollection = await this.framework.database.collection('tickets');
        const totalTickets = await ticketsCollection.countDocuments({ guildId }).catch(() => 0);
        const openTickets = await ticketsCollection.countDocuments({ guildId, status: 'open' }).catch(() => 0);
        const closedTickets = await ticketsCollection.countDocuments({ guildId, status: 'closed' }).catch(() => 0);
        const recentTickets = await ticketsCollection.find({ guildId }).sort({ createdAt: -1 }).limit(5).toArray().catch(() => []);

        const tickets = [] as Array<{ channelId: string; userTag: string; status: string; createdAt: Date }>;
        for (const ticket of recentTickets) {
            const user = await this.client.users.fetch(ticket.userId).catch(() => null);
            tickets.push({
                channelId: ticket.channelId,
                userTag: user ? `${user.username}#${user.discriminator}` : ticket.userId,
                status: ticket.status,
                createdAt: ticket.createdAt,
            });
        }

        const content = await ejs.renderFile(
            path.resolve(__dirname, '../views/ticket-dashboard.ejs'),
            {
                guild,
                stats: {
                    total: totalTickets,
                    open: openTickets,
                    closed: closedTickets,
                },
                tickets,
            }
        );
        const view = new UserPanelViewService();
        const html = await view.render({ content, reqPath: req.path, req, res });
        res.send(html);
    }
}
