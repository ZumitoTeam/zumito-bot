import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { TaskService } from "../services/TaskService";
import { Client } from "discord.js";

export class AdminTasksApiComment extends Route {
    method = RouteMethod.post;
    path = '/admin/tasks/api/comment';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private taskService: TaskService = ServiceContainer.getService(TaskService),
        private client: Client = ServiceContainer.getService(Client),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;
        const body = req.body || {};
        const id = String(body.id || '');
        // Prefer authenticated user info; fall back to body
        const auth: any = await (this.adminAuthService as any).isLoginValid(req).catch(() => null);
        let userId = String((auth && (auth.user?.id || auth.data?.discordUserData?.id || auth.data?.user?.id || auth.data?.discordUserId))
            || req.user?.id || req.user?.discord?.id || body.userId || '');
        let userName = String((auth && (auth.user?.name || auth.data?.discordUserData?.globalName || auth.data?.discordUserData?.username))
            || req.user?.name || body.userName || '');
        let userAvatar: string | undefined = (typeof body.userAvatar === 'string' ? String(body.userAvatar) : undefined);
        try {
            if (userId) {
                const u = await this.client.users.fetch(userId).catch(() => null as any);
                if (u) {
                    userName = (u.globalName || u.username || userName || userId);
                    userAvatar = typeof u.displayAvatarURL === 'function' ? u.displayAvatarURL({ forceStatic: true, size: 64 }) : userAvatar;
                }
            }
        } catch {}
        const text = String(body.text || '').trim();
        if (!id || !userId || !text) return res.status(400).json({ ok: false, error: 'Missing fields' });

        const updated = await this.taskService.addComment(id, { user: { id: userId, name: userName || userId, avatar: userAvatar }, text });
        res.json({ ok: true, task: updated });
    }
}
