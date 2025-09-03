import { Route, RouteMethod, ServiceContainer, TranslationManager } from "zumito-framework";
import { AdminViewService } from "@zumito-team/admin-module/services/AdminViewService";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { TaskItem, TaskService } from "../services/TaskService";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AdminTasksPendingReview extends Route {
    method = RouteMethod.get;
    path = '/admin/tasks/pending';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private adminViewService: AdminViewService = ServiceContainer.getService(AdminViewService),
        private taskService: TaskService = ServiceContainer.getService(TaskService),
        private translationService: TranslationManager = ServiceContainer.getService(TranslationManager),
    ) { super(); }

    async execute(req: any, res: any) {
        const auth = await this.adminAuthService.isLoginValid(req).catch(() => null);
        const isValid = (auth && (auth.isValid === true || auth === true)) ? true : false;
        if (!isValid) return res.redirect('/admin/login');

        const tokenInfo = this.getTokenFromReq(req);
        const decoded = tokenInfo.token ? this.decodeJwt(tokenInfo.token) : null;

        const userId = (auth && (auth.user?.id || auth.data?.discordUserData?.id || auth.data?.user?.id || auth.data?.discordUserId))
            || req.user?.id
            || req.user?.discord?.id
            || req.query?.uid
            || decoded?.payload?.discordUserId
            || this.getUserIdFromToken(req);
        const debugEnabled = String(req.query?.debug || '').toLowerCase() === '1';
        if (!userId) {
            const debugBlock = `
            <div class="card mt-6 p-4">
              <div class="text-red-400 font-semibold mb-2">Cannot resolve your user id; pending list unavailable.</div>
              <pre class="whitespace-pre-wrap text-xs bg-discord-dark-300 p-3 rounded overflow-x-auto">${this.safeJson({
        auth,
        reqUser: req.user,
        tokenSource: tokenInfo.source,
        tokenHeader: decoded?.header || null,
        tokenPayload: decoded?.payload || null,
        resolvedFromToken: this.getUserIdFromToken(req) || null,
      })}</pre>
            </div>`;
            const content = await this.adminViewService.render({
                title: 'Pending Reviews',
                content: debugBlock,
                reqPath: this.path,
                user: req.user || { name: 'Admin' }
            });
            return res.send(content);
        }

        const col = (this.taskService as any).col();
        const tasks: TaskItem[] = await col.find({ "testers.id": String(userId), lastReviewRequestAt: { $exists: true } }).toArray();
        const pending = tasks.filter(t => {
            const reqAt = (t as any).lastReviewRequestAt as number | undefined;
            if (!reqAt) return false;
            const me = (t.testers || []).find(tt => tt.id === String(userId));
            const last = me?.lastApprovalAt || 0;
            return last < reqAt; // needs action if last approval is older than request
        });

        let pageContent = await ejs.renderFile(path.resolve(__dirname, '../views/admin_pending_review.ejs'), { tasks: pending, t: this.translationService, userId: String(userId), userName: (auth as any)?.user?.name || (auth as any)?.data?.discordUserData?.globalName || (auth as any)?.data?.discordUserData?.username || String(userId) });
        if (debugEnabled) {
            const debugBlock = `
            <div class="card mt-6 p-4">
              <div class="text-discord-light-100 mb-2">Debug Info</div>
              <pre class="whitespace-pre-wrap text-xs bg-discord-dark-300 p-3 rounded overflow-x-auto">${this.safeJson({
        resolvedUserId: String(userId),
        auth,
        reqUser: req.user,
        tokenSource: tokenInfo.source,
        tokenHeader: decoded?.header || null,
        tokenPayload: decoded?.payload || null,
      })}</pre>
            </div>`;
            pageContent = debugBlock + pageContent;
        }
        const content = await this.adminViewService.render({
            title: this.translationService.get('tasks.review.pendingTitle') || 'Pending Reviews',
            content: pageContent,
            reqPath: this.path,
            user: req.user || { name: 'Admin' }
        });

        res.send(content);
    }

    private getTokenFromReq(req: any): { token?: string; source?: string } {
        const header = (req.headers && (req.headers.authorization || req.headers.Authorization)) as string | undefined;
        if (header && header.startsWith('Bearer ')) return { token: header.slice(7), source: 'Authorization' };
        if (req.headers && req.headers.cookie) {
            const m = String(req.headers.cookie).split(';').map((s: string) => s.trim()).find((c: string) => c.startsWith('admin_token='));
            if (m) return { token: m.split('=')[1], source: 'cookie:admin_token' };
        }
        return {};
    }

    private decodeJwt(token: string): { header?: any; payload?: any } | null {
        try {
            const [h, p] = token.split('.');
            const header = JSON.parse(Buffer.from(h.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
            const payload = JSON.parse(Buffer.from(p.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
            return { header, payload };
        } catch { return null; }
    }

    private safeJson(obj: any): string {
        try { return JSON.stringify(obj, null, 2); } catch { return String(obj); }
    }

    private getUserIdFromToken(req: any): string | undefined {
        try {
            const header = (req.headers && (req.headers.authorization || req.headers.Authorization)) as string | undefined;
            let token: string | undefined;
            if (header && header.startsWith('Bearer ')) token = header.slice(7);
            if (!token && req.headers && req.headers.cookie) {
                const m = String(req.headers.cookie).split(';').map((s: string) => s.trim()).find((c: string) => c.startsWith('admin_token='));
                if (m) token = m.split('=')[1];
            }
            if (!token) return undefined;
            const parts = token.split('.');
            if (parts.length < 2) return undefined;
            const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
            return payload?.discordUserId || payload?.id || payload?.user?.id || payload?.discordUserData?.id || payload?.discord?.id;
        } catch {
            return undefined;
        }
    }
}
