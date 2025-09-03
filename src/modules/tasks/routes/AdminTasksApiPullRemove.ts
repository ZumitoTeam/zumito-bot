import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { TaskService } from "../services/TaskService";

export class AdminTasksApiPullRemove extends Route {
    method = RouteMethod.post;
    path = '/admin/tasks/api/pull/remove';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private taskService: TaskService = ServiceContainer.getService(TaskService),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;
        const { id, repo, number } = req.body || {};
        if (!id || !repo || !number) return res.status(400).json({ ok: false, error: 'Missing fields' });
        const task = await this.taskService.removePull(String(id), String(repo), Number(number));
        res.json({ ok: true, task });
    }
}

