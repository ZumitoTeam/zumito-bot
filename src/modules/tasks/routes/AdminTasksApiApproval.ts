import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { TaskService } from "../services/TaskService";
import { Client } from "discord.js";

export class AdminTasksApiApproval extends Route {
    method = RouteMethod.post;
    path = '/admin/tasks/api/approval';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private taskService: TaskService = ServiceContainer.getService(TaskService),
        private client: Client = ServiceContainer.getService(Client),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;
        const body = req.body || {};
        const id = String(body.id || '');
        const testerId = String(body.testerId || '');
        let testerName = String(body.testerName || '');
        const approved = Boolean(body.approved);
        const comment = String(body.comment || '').trim();
        if (!id || !testerId) return res.status(400).json({ ok: false, error: 'Missing fields' });

        let avatar: string | null = null;
        try {
            const user = await this.client.users.fetch(String(testerId)).catch(() => null as any);
            if (user) {
                testerName = (user.globalName || user.username || testerName || String(testerId));
                avatar = typeof user.displayAvatarURL === 'function' ? user.displayAvatarURL({ forceStatic: true, size: 64 }) : null;
            }
        } catch {}

        let updated = await this.taskService.setTesterApproval(id, testerId, approved, testerName);
        if (comment) {
            updated = await this.taskService.addComment(id, { user: { id: testerId, name: testerName || testerId, avatar }, text: comment });
        }
        // Move task to appropriate column based on approval/denial
        try {
            const task = updated || await this.taskService.update(id, {});
            const testers = (task && task.testers) || [];
            if (approved === false) {
                await this.taskService.update(id, { status: 'pendingFix' } as any);
            } else {
                if (testers.length > 0 && testers.every((t: any) => t.approved === true)) {
                    await this.taskService.update(id, { status: 'pendingPublish' } as any);
                }
            }
        } catch {}
        res.json({ ok: true, task: updated });
    }
}
