import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from 'zumito-framework';
import { AdminAuthService } from '../services/AdminAuthService';

export class AdminSuperadminsRemove extends Route {
    method = RouteMethod.post;
    path = '/admin/superadmins/remove';

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService)
    ) {
        super();
    }

    async execute(req: any, res: any) {
        if (!await this.adminAuthService.isLoginValid(req).then(r => r.isValid)) return res.status(403).send('Access Denied');
        try {
            const { discordUserId } = req.body;
            if (!discordUserId) {
                return res.status(400).send('Falta el Discord User ID');
            }
            await this.framework.database.collection('admin_users').deleteOne({ discordUserId, isSuperAdmin: true });
            res.redirect('/admin/superadmins');
        } catch (err) {
            const errMsg = (typeof err === 'object' && err && 'message' in err) ? (err as any).message : String(err);
            console.error('Error al eliminar superadmin:', errMsg);
            res.status(500).send('Error al eliminar superadmin');
        }
    }
}
