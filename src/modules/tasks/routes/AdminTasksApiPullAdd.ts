import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { TaskService } from "../services/TaskService";

export class AdminTasksApiPullAdd extends Route {
    method = RouteMethod.post;
    path = '/admin/tasks/api/pull/add';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private taskService: TaskService = ServiceContainer.getService(TaskService),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;
        const { id, repo, number, url, state } = req.body || {};
        if (!id || !repo || !number || !url) return res.status(400).json({ ok: false, error: 'Missing fields' });
        const task = await this.taskService.addPull(String(id), { repo: String(repo), number: Number(number), url: String(url), state: state || 'unknown' });
        res.json({ ok: true, task });
    }
}

