import { Route, RouteMethod, ServiceContainer, TranslationManager, ZumitoFramework } from "zumito-framework";
import { AdminViewService } from "@zumito-team/admin-module/services/AdminViewService";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import path from "path";
import { fileURLToPath } from "url";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AdminTasks extends Route {
    method = RouteMethod.get;
    path = '/admin/tasks/kanban';

    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private adminViewService: AdminViewService = ServiceContainer.getService(AdminViewService),
        private translationService: TranslationManager = ServiceContainer.getService(TranslationManager),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) {
            return;
        }

        const content = await this.adminViewService.render({
            title: 'Tasks Kanban',
            content: await ejs.renderFile(path.resolve(__dirname, '../views/admin_kanban.ejs'), {
                t: this.translationService,
            }),
            reqPath: this.path,
            user: req.user || { name: 'Admin' }
        });

        res.send(content);
    }
}

