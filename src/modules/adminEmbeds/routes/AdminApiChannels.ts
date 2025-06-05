import { AdminAuthService } from "src/modules/admin/services/AdminAuthService";
import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { Client, ChannelType } from "zumito-framework/discord";

export class AdminApiChannels extends Route {
    method = RouteMethod.get;
    path = '/admin/api/channels/:guildId';

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService)
    ) {
        super();
        this.client = ServiceContainer.getService(Client);
    }

    async execute(req, res) {
        if (!await this.adminAuthService.isLoginValid(req).then(r => r.isValid)) return res.status(403).json({ error: 'Access Denied' });

        const { guildId } = req.params;
        const guild = this.client.guilds.cache.get(guildId);

        if (!guild) {
            return res.status(404).json({ error: 'Server not found' });
        }

        // Obtener solo los canales de texto
        const textChannels = guild.channels.cache
            .filter(channel => channel.type === ChannelType.GuildText)
            .map(channel => ({
                id: channel.id,
                name: channel.name
            }));

        res.json(textChannels);
    }

}
