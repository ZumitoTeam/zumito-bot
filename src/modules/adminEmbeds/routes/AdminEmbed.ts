import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import ejs from 'ejs';
import { Client } from "zumito-framework/discord";
import { NavigationService } from "../../admin/services/NavigationService";
import { AdminViewService } from "../../admin/services/AdminViewService";
import { AdminAuthService } from "src/modules/admin/services/AdminAuthService";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class AdminEmbed extends Route {
    method = RouteMethod.get;
    path = '/admin/embed';

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService)
    ) {
        super();
    }

    async execute(req, res) {
        if (!await this.adminAuthService.isLoginValid(req).then(r => r.isValid)) return res.redirect('/admin/login');

        const guilds = Array.from(this.client.guilds.cache.values()).map(guild => ({
            id: guild.id,
            name: guild.name
        }));

        // Renderizar la vista del formulario de embed
        const content = await ejs.renderFile(
            path.resolve(__dirname, '../views/embed.ejs'),
            { 
                guilds
            }
        );

        const adminView = new AdminViewService();
        const html = await adminView.render({
            title: 'Send Embed',
            content,
            reqPath: this.path,
            user: { name: 'Admin' }
        });

        res.send(html);
    }
}
