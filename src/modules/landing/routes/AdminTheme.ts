import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { AdminViewService } from "@zumito-team/admin-module/services/AdminViewService";
import { LandingViewService } from "../services/LandingViewService";
import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class AdminTheme extends Route {
    method = RouteMethod.get;
    path = '/admin/landing/theme';

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private adminViewService: AdminViewService = ServiceContainer.getService(AdminViewService),
        private landingViewService: LandingViewService = ServiceContainer.getService(LandingViewService),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) {
            return;
        }

        const theme = await this.landingViewService.getTheme();
        const content = await this.adminViewService.render({
            title: 'Landing Theme',
            content: await ejs.renderFile(path.resolve(__dirname, '../views/admin_theme.ejs'), { theme }),
            reqPath: this.path,
            user: req.user || { name: 'Admin' }
        });

        res.send(content);
    }
}
