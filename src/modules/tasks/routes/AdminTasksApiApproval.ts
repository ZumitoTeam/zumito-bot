import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { TaskService } from "../services/TaskService";

export class AdminTasksApiApproval extends Route {
    method = RouteMethod.post;
    path = '/admin/tasks/api/approval';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private taskService: TaskService = ServiceContainer.getService(TaskService),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;
        const body = req.body || {};
        const id = String(body.id || '');
        const testerId = String(body.testerId || '');
        const testerName = String(body.testerName || '');
        const approved = Boolean(body.approved);
        if (!id || !testerId) return res.status(400).json({ ok: false, error: 'Missing fields' });

        const updated = await this.taskService.setTesterApproval(id, testerId, approved, testerName);
        res.json({ ok: true, task: updated });
    }
}

