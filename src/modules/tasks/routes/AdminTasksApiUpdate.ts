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
        if (typeof body.status === 'string' && ['backlog','working','testing','pendingFix','pendingPublish','beta','done'].includes(body.status)) patch.status = body.status as TaskStatus;
        if (typeof body.public === 'boolean') patch.public = body.public;
        if (Array.isArray(body.assignees)) patch.assignees = body.assignees;
        if (Array.isArray(body.testers)) patch.testers = body.testers;
        if (body.github === null) patch.github = undefined;
        else if (body.github && body.github.url) patch.github = body.github;
        if (body.githubProject === null) patch.githubProject = null;
        else if (body.githubProject) patch.githubProject = body.githubProject;
        if (typeof body.repo === 'string') patch.repo = body.repo;
        if (typeof body.branch === 'string') patch.branch = body.branch;
        if (body.issue === null) patch.issue = null;
        else if (body.issue && body.issue.url) patch.issue = body.issue;
        if (Array.isArray(body.pulls)) patch.pulls = body.pulls;
        if (body.owner === null) patch.owner = null;
        else if (body.owner) patch.owner = body.owner;

        // Detect status change
        let before: any = null;
        try { before = await (this.taskService as any)["col"]().findOne({ id }); } catch {}

        const updated = await this.taskService.update(id, patch);

        // Log status change if any
        try {
            if (typeof patch.status === 'string' && before && before.status && before.status !== patch.status) {
                await this.taskService.addActivity(id, {
                    type: 'statusChanged',
                    details: { from: before.status, to: patch.status }
                });
            }
        } catch {}
        res.json({ ok: true, task: updated });
    }
}
