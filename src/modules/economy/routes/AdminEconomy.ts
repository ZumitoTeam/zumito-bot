import { Route, RouteMethod, ServiceContainer } from 'zumito-framework';
import { AdminViewService } from "@zumito-team/admin-module/services/AdminViewService";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { EconomyService } from '../services/EconomyService';
import { Client } from 'zumito-framework/discord';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class AdminEconomy extends Route {
    method = RouteMethod.get;
    path = '/admin/economy';

    constructor(
        private adminAuthService = ServiceContainer.getService(AdminAuthService),
        private economyService = ServiceContainer.getService(EconomyService),
        private client: Client = ServiceContainer.getService(Client),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        if (!await this.adminAuthService.isLoginValid(req).then(r => r.isValid)) return res.redirect('/admin/login');
        const userId = req.query.userId as string | undefined;
        let user: any = null;
        let username = '';
        if (userId) {
            user = await this.economyService.getUser(userId).catch(() => null);
            if (!user) user = { free: 0, paid: 0 };
            try {
                const fetched = await this.client.users.fetch(userId);
                username = fetched.username;
            } catch {}
        }
        const content = await ejs.renderFile(
            path.resolve(__dirname, '../views/economy.ejs'),
            { userId, user, username }
        );
        const view = new AdminViewService();
        const html = await view.render({
            title: 'Economy',
            content,
            reqPath: this.path,
            user: req.user || { name: 'Admin' },
        });
        res.send(html);
    }
}
