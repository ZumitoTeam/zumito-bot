import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { TaskItem, TaskService, TaskStatus } from "../services/TaskService";

export class AdminTasksApiCreate extends Route {
    method = RouteMethod.post;
    path = '/admin/tasks/api/create';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private taskService: TaskService = ServiceContainer.getService(TaskService),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;

        const body = req.body || {};
        const payload: Partial<TaskItem> = {
            title: String(body.title || '').slice(0, 200),
            description: String(body.description || ''),
            status: (['backlog','working','testing','beta','done'].includes(body.status) ? body.status : 'backlog') as TaskStatus,
            assignees: Array.isArray(body.assignees) ? body.assignees : [],
            testers: Array.isArray(body.testers) ? body.testers : [],
            github: body.github && body.github.url ? body.github : undefined,
        };

        const created = await this.taskService.create(payload);
        res.json({ ok: true, task: created });
    }
}

