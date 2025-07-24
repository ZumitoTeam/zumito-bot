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
        const existing = await collection.find().toArray();
        const names = modules.map(m => m.name);
        for (const mod of modules) {
            await collection.updateOne(
                { name: mod.name },
                { $set: { order: parseInt(mod.order), enabled: mod.enabled === 'true' || mod.enabled === true || mod.enabled === 'on' } },
                { upsert: true }
            );
        }
        for (const mod of existing) {
            if (!names.includes(mod.name)) {
                await collection.deleteOne({ name: mod.name });
            }
        }
        res.status(200).json({ message: 'Modules updated successfully.' });
    }
}
