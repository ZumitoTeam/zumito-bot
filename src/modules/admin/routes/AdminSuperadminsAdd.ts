import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from 'zumito-framework';
import { Client } from "zumito-framework/discord";
import { AdminAuthService } from '../services/AdminAuthService';

export class AdminSuperadminsAdd extends Route {
    method = RouteMethod.post;
    path = '/admin/superadmins/add';

    private framework: ZumitoFramework;
    private adminAuthService: AdminAuthService;

    constructor() {
        super();
        this.framework = ServiceContainer.getService(ZumitoFramework);
        this.adminAuthService = ServiceContainer.getService(AdminAuthService);
    }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req).isValid) return res.status(403).send('Access Denied');
        try {
            const { discordUserId } = req.body;
            if (!discordUserId) {
                return res.status(400).send('Falta el Discord User ID');
            }

            // Intentar obtener username si el bot lo tiene en caché
            let username = '';
            try {
                const client = ServiceContainer.getService(Client) as Client;
                const user = await client.users.fetch(discordUserId);
                if (user) username = user.username;
            } catch (e) {
                // No se pudo obtener el username, continuar sin él
            }
            await this.framework.database.models.AdminUser.create({
                discordUserId,
                username,
                isSuperAdmin: true,
                createdAt: new Date()
            });
            return res.redirect('/admin/superadmins');
        } catch (err) {
            const errMsg = (typeof err === 'object' && err && 'message' in err) ? (err as any).message : String(err);
            console.error('Error al agregar superadmin:', errMsg);
            res.status(500).send('Error al agregar superadmin');
        }
    }
}
