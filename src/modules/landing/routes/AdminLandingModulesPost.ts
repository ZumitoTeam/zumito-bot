import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";

export class AdminLandingModulesPost extends Route {
    method = RouteMethod.post;
    path = '/admin/landing/modules';

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return res.status(400).json({ message: 'Access Denied' });

        const modules = req.body.modules;
        if (!Array.isArray(modules)) return res.status(400).json({ message: 'Invalid data.' });

        const collection = this.framework.database.collection('landingmodules');
        for (const mod of modules) {
            await collection.updateOne(
                { name: mod.name },
                { $set: { order: parseInt(mod.order), enabled: mod.enabled === 'true' || mod.enabled === true || mod.enabled === 'on' } }
            );
        }
        res.status(200).json({ message: 'Modules updated successfully.' });
    }
}
