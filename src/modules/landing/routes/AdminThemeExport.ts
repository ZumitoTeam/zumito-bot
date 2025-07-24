import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { LandingViewService } from "../services/LandingViewService";

export class AdminThemeExport extends Route {
    method = RouteMethod.get;
    path = '/admin/landing/theme/export';

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private landingViewService: LandingViewService = ServiceContainer.getService(LandingViewService),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return res.status(400).json({ message: 'Access Denied' });

        const theme = await this.landingViewService.getTheme();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(theme));
    }
}
