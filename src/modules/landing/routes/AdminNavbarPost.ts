import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";

export class AdminNavbarPost extends Route {
    method = RouteMethod.post;
    path = '/admin/landing/navbar';

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return res.status(400).json({ message: 'Access Denied' });

        const links = req.body.links;
        if (!Array.isArray(links)) return res.status(400).json({ message: 'Invalid data.' });

        const collection = this.framework.database.collection('landingnavbar');
        const existing = await collection.find().toArray();
        const labels = links.map(l => l.label);
        for (const link of links) {
            await collection.updateOne(
                { label: link.label },
                { $set: { url: link.url, order: parseInt(link.order) } },
                { upsert: true }
            );
        }
        for (const link of existing) {
            if (!labels.includes(link.label)) {
                await collection.deleteOne({ label: link.label });
            }
        }
        res.status(200).json({ message: 'Navbar saved.' });
    }
}
