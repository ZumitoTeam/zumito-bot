import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";

export class AdminThemePost extends Route {
    method = RouteMethod.post;
    path = '/admin/landing/theme';

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return res.status(400).json({ message: 'Access Denied' });

        const allowed = ['primary','secondary','accent','gradientFrom','gradientVia','gradientTo','textMain','textSecondary','background'];
        const data: Record<string, string> = {};
        for (const key of allowed) {
            if (req.body && req.body[key]) data[key] = req.body[key];
        }

        await this.framework.database.collection('landingtheme').updateOne(
            { id: 'default' },
            { $set: data },
            { upsert: true }
        );

        res.status(200).json({ message: 'Theme saved successfully.' });
    }
}
