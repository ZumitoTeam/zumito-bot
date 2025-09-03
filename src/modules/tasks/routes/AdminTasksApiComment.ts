import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { TaskService } from "../services/TaskService";

export class AdminTasksApiComment extends Route {
    method = RouteMethod.post;
    path = '/admin/tasks/api/comment';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private taskService: TaskService = ServiceContainer.getService(TaskService),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;
        const body = req.body || {};
        const id = String(body.id || '');
        const userId = String(body.userId || '');
        const userName = String(body.userName || '');
        const text = String(body.text || '').trim();
        if (!id || !userId || !text) return res.status(400).json({ ok: false, error: 'Missing fields' });

        const updated = await this.taskService.addComment(id, { user: { id: userId, name: userName || userId }, text });
        res.json({ ok: true, task: updated });
    }
}

