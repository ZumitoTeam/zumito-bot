import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { AdminViewService } from "@zumito-team/admin-module/services/AdminViewService";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { DEFAULT_NAVBAR_LINKS } from "../definitions/defaultNavbarLinks";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AdminNavbar extends Route {
    method = RouteMethod.get;
    path = '/admin/landing/navbar';

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

        const collection = this.framework.database.collection('landingnavbar');
        let links = await collection.find().sort({ order: 1 }).toArray();
        if (links.length === 0) {
            await collection.insertMany(DEFAULT_NAVBAR_LINKS);
            links = DEFAULT_NAVBAR_LINKS;
        }

        const routes = (this.framework.routes || []).filter((r: any) => {
            return r.method !== RouteMethod.post && !r.path.includes(':');
        }).map((r: any) => r.path);

        const content = await this.adminViewService.render({
            title: 'Navbar',
            content: await ejs.renderFile(path.resolve(__dirname, '../views/admin_navbar.ejs'), { links, routes }),
            reqPath: this.path,
            user: req.user || { name: 'Admin' }
        });

        res.send(content);
    }
}
