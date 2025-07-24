import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { AdminViewService } from "@zumito-team/admin-module/services/AdminViewService";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AdminLandingModules extends Route {
    method = RouteMethod.get;
    path = '/admin/landing/modules';

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private adminViewService: AdminViewService = ServiceContainer.getService(AdminViewService),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) {
            return;
        }

        const collection = this.framework.database.collection('landingmodules');
        let modules = await collection.find().toArray();
        if (modules.length === 0) {
            modules = [
                { name: 'hero', order: 1, enabled: true },
                { name: 'stats', order: 2, enabled: true },
                { name: 'featuredCommands', order: 3, enabled: true },
                { name: 'features', order: 4, enabled: true },
                { name: 'faqs', order: 5, enabled: true },
                { name: 'cta', order: 6, enabled: true },
            ];
            await collection.insertMany(modules);
        }
        modules.sort((a, b) => a.order - b.order);

        const content = await this.adminViewService.render({
            title: 'Landing Modules',
            content: await ejs.renderFile(path.resolve(__dirname, '../views/admin_landing_modules.ejs'), { modules }),
            reqPath: this.path,
            user: req.user || { name: 'Admin' }
        });

        res.send(content);
    }
}
