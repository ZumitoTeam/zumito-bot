import { AdminAuthService } from "src/modules/admin/services/AdminAuthService";
import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { Client, EmbedBuilder } from "zumito-framework/discord";

export class AdminApiSendEmbed extends Route {
    method = RouteMethod.post;
    path = '/admin/api/send-embed';

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService)
    ) {
        super();
    }

    async execute(req, res) {
        if (!this.adminAuthService.isLoginValid(req).isValid) {
            return res.status(403).json({ error: 'Access Denied' });
        }

        const { guildId, channelId, embed } = req.body;

        try {
            const guild = this.client.guilds.cache.get(guildId);
            if (!guild) {
                return res.status(404).json({ error: 'Server not found' });
            }

            const channel = guild.channels.cache.get(channelId);
            if (!channel?.isTextBased()) {
                return res.status(404).json({ error: 'Channel not found or is not a text channel' });
            }

            // Crear el embed con los datos recibidos
            const embedBuilder = new EmbedBuilder(embed);
            
            // Enviar el embed
            await channel.send({ embeds: [embedBuilder] });

            res.json({ success: true });
        } catch (error) {
            console.error('Error sending embed:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message || 'Internal server error' 
            });
        }
    }
}
