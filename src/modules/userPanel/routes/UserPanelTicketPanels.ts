import { Route, RouteMethod, ServiceContainer } from 'zumito-framework';
import { Client, PermissionFlagsBits } from 'discord.js';
import { UserPanelAuthService } from '../services/UserPanelAuthService';
import { UserPanelViewService } from '../services/UserPanelViewService';
import { TicketPanelService } from '../../tickets/services/TicketPanelService';
import ejs from 'ejs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class UserPanelTicketPanels extends Route {
    method = RouteMethod.get;
    path = '/panel/:guildId(\\d+)/ticket-panels';

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private authService = ServiceContainer.getService(UserPanelAuthService),
        private ticketPanelService = new TicketPanelService(),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const auth = await this.authService.isLoginValid(req);
        if (!auth.isValid) return res.redirect('/panel/login');
        const guildId = req.params.guildId as string;
        const userId = auth.data.discordUserData.id;
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return res.status(404).send('Servidor no encontrado');
        let member = guild.members.cache.get(userId);
        if (!member) member = await guild.members.fetch(userId).catch(() => null);
        if (!member || !(member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ManageGuild) || guild.ownerId === userId)) {
            return res.status(403).send('No tienes permisos en este servidor');
        }
        const panels = await this.ticketPanelService.getTicketPanels(guildId);
        const content = await ejs.renderFile(
            path.resolve(__dirname, '../views/ticket-panels.ejs'),
            { guild, panels }
        );
        const view = new UserPanelViewService();
        const html = await view.render({ content, reqPath: req.path, req, res });
        res.send(html);
    }
}
