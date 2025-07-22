import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from 'zumito-framework';
import ejs from 'ejs';
import path from 'path';
import { AdminViewService } from "../services/AdminViewService";
import { AdminAuthService } from '../services/AdminAuthService';

export class AdminSuperadmins extends Route {
    method = RouteMethod.get;
    path = '/admin/superadmins';

    private framework: ZumitoFramework;
    private adminAuthService: AdminAuthService;

    constructor() {
        super();
        this.framework = ServiceContainer.getService(ZumitoFramework);
        this.adminAuthService = ServiceContainer.getService(AdminAuthService);
    }

    async execute(req: any, res: any) {
        if (!await this.adminAuthService.isLoginValid(req).then(r => r.isValid)) return res.redirect('/admin/login');
        const superadmins = await this.framework.database.collection('admin_users').find({ isSuperAdmin: true }).toArray();
        const content = await ejs.renderFile(
            path.resolve(__dirname, '../views/superadmins.ejs'),
            { superadmins }
        );
        const adminView = new AdminViewService();
        const html = await adminView.render({
            title: 'Superadmins',
            content,
            reqPath: this.path,
            user: req.user || { name: 'Admin' }
        });
        res.send(html);
    }
}
