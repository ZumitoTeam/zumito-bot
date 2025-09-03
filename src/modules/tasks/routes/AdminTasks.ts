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

        // Resolve viewer info for comments attribution in UI
        let viewerId: string = '';
        let viewerName: string = 'Admin';
        let viewerAvatar: string | null = null;
        try {
            const auth: any = await (this.adminAuthService as any).isLoginValid(req).catch(() => null);
            viewerId = (auth && (auth.user?.id || auth.data?.discordUserData?.id || auth.data?.user?.id || auth.data?.discordUserId))
                || req.user?.id || req.user?.discord?.id || '';
            viewerName = (auth && (auth.user?.name || auth.data?.discordUserData?.globalName || auth.data?.discordUserData?.username))
                || req.user?.name || 'Admin';
            const av = (auth && (auth.user?.avatar || auth.data?.discordUserData?.avatar)) || (req.user?.avatar);
            if (av && viewerId) {
                viewerAvatar = `https://cdn.discordapp.com/avatars/${viewerId}/${av}.png?size=64`;
            }
        } catch {}

        const content = await this.adminViewService.render({
            title: 'Tasks Kanban',
            content: await ejs.renderFile(path.resolve(__dirname, '../views/admin_kanban.ejs'), {
                t: this.translationService,
                viewer: { id: viewerId, name: viewerName, avatar: viewerAvatar },
            }),
            reqPath: this.path,
            user: req.user || { name: 'Admin' }
        });

        res.send(content);
    }
}
