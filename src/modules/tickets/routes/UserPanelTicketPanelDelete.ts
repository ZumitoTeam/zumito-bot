import { Route, RouteMethod, ServiceContainer } from 'zumito-framework';
import { Client, PermissionFlagsBits } from 'discord.js';
import { UserPanelAuthService } from '@zumito-team/user-panel-module/services/UserPanelAuthService';
import { TicketPanelService } from '../../tickets/services/TicketPanelService';

export class UserPanelTicketPanelDelete extends Route {
    method = RouteMethod.post;
    path = '/panel/:guildId(\\d+)/ticket/panels/delete/:panelId';

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
        await this.ticketPanelService.deleteTicketPanel(req.params.panelId);
        res.redirect(`/panel/${guildId}/ticket/panels`);
    }
}
