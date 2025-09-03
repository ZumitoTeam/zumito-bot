import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { TaskItem, TaskService, TaskStatus } from "../services/TaskService";

export class AdminTasksApiUpdate extends Route {
    method = RouteMethod.post;
    path = '/admin/tasks/api/update';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private taskService: TaskService = ServiceContainer.getService(TaskService),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;
        const body = req.body || {};
        const id = String(body.id || '');
        if (!id) return res.status(400).json({ ok: false, error: 'Missing id' });

        const patch: Partial<TaskItem> = {};
        if (typeof body.title === 'string') patch.title = body.title.slice(0, 200);
        if (typeof body.description === 'string') patch.description = body.description;
        if (typeof body.status === 'string' && ['backlog','working','testing','beta','done'].includes(body.status)) patch.status = body.status as TaskStatus;
        if (Array.isArray(body.assignees)) patch.assignees = body.assignees;
        if (Array.isArray(body.testers)) patch.testers = body.testers;
        if (body.github === null) patch.github = undefined;
        else if (body.github && body.github.url) patch.github = body.github;

        const updated = await this.taskService.update(id, patch);
        res.json({ ok: true, task: updated });
    }
}

