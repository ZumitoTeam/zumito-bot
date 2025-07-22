import { Route, RouteMethod, ServiceContainer, TranslationManager, ZumitoFramework } from "zumito-framework";
import { AdminAuthService } from "../../admin/services/AdminAuthService";
import { FeaturedCommand } from "../models/FeaturedCommand";
import { AdminViewService } from "../../admin/services/AdminViewService";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export class AdminFeaturedCommands extends Route {
    method = RouteMethod.get;
    path = '/admin/landing/featured-commands';

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private adminViewService: AdminViewService = ServiceContainer.getService(AdminViewService),
        private translationService: TranslationManager = ServiceContainer.getService(TranslationManager),
    ) {
        super();
    }

    async execute(req, res) {
        if (!this.adminAuthService.isLoginValid(req)) {
            return;
        }

        const featuredCommands = await this.framework.database.collection('featuredcommands').find().sort({ order: 1 }).toArray();
        const allCommands = Array.from(this.framework.commands.getAll().values());

        const content = await this.adminViewService.render({
            title: 'Featured Commands',
            content: await ejs.renderFile(path.resolve(__dirname, '../views/admin_featured_commands.ejs'), {
                featuredCommands: featuredCommands,
                allCommands: allCommands.map(cmd => ({ name: cmd.name })),
                t: this.translationService,
            }),
            reqPath: this.path,
            user: req.user || { name: 'Admin' }
        });

        res.send(content);
    }
}
