import { Route, RouteMethod, ServiceContainer } from 'zumito-framework';
import { Client, PermissionFlagsBits } from 'discord.js';
import { UserPanelAuthService } from '../services/UserPanelAuthService';
import { TicketPanelService } from '../../tickets/services/TicketPanelService';

export class UserPanelTicketPanelSend extends Route {
    method = RouteMethod.post;
    path = '/panel/:guildId(\\d+)/ticket/panels/send/:panelId';

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
        const panel = await this.ticketPanelService.getTicketPanel(req.params.panelId).catch(() => null);
        if (!panel) return res.status(404).send('Panel no encontrado');
        await this.ticketPanelService.sendTicketPanel(req.params.panelId, panel.channelId);
        res.redirect(`/panel/${guildId}/ticket/panels`);
    }
}
