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

        // Load old task for status change detection
        let before: any = null;
        try { before = await (this.taskService as any)["col"]().findOne({ id }); } catch {}

        let avatar: string | null = null;
        try {
            const user = await this.client.users.fetch(String(testerId)).catch(() => null as any);
            if (user) {
                testerName = (user.globalName || user.username || testerName || String(testerId));
                avatar = typeof user.displayAvatarURL === 'function' ? user.displayAvatarURL({ forceStatic: true, size: 64 }) : null;
            }
        } catch {}

        // Capture previous approval state
        const prevTester = before && Array.isArray(before.testers) ? (before.testers as any[]).find(t => String(t.id) === String(testerId)) : null;
        const prevApproved = prevTester ? Boolean(prevTester.approved) : undefined;
        const lastReq = before?.lastReviewRequestAt || 0;
        const prevLastApproval = prevTester ? (prevTester.lastApprovalAt || 0) : 0;
        const approvalReconfirmed = approved === true && prevApproved === true && prevLastApproval < lastReq;
        const denialReconfirmed = approved === false && prevApproved === false && prevLastApproval < lastReq;

        let updated = await this.taskService.setTesterApproval(id, testerId, approved, testerName);
        if (comment) {
            updated = await this.taskService.addComment(id, { user: { id: testerId, name: testerName || testerId, avatar }, text: comment });
        }
        // Move task to appropriate column based on approval/denial
        try {
            // React if approval changed or if confirming after a newer review request
            if (prevApproved === undefined || prevApproved !== approved || approvalReconfirmed || denialReconfirmed) {
                const task = updated || await this.taskService.update(id, {});
                const testers = (task && task.testers) || [];
                if (approved === false) {
                    await this.taskService.update(id, { status: 'pendingFix' } as any);
                } else {
                    if (testers.length > 0 && testers.every((t: any) => t.approved === true)) {
                        await this.taskService.update(id, { status: 'pendingPublish' } as any);
                    }
                }
                // Log approval/denial when it changes
                await this.taskService.addActivity(id, {
                    type: approved ? 'reviewApproved' : 'reviewDenied',
                    user: { id: testerId, name: testerName || testerId, avatar },
                    details: comment ? { comment } : undefined,
                });
            }
        } catch {}
        // Detect and log status change
        try {
            const after = await (this.taskService as any)["col"]().findOne({ id });
            const from = before?.status;
            const to = after?.status;
            if (from && to && from !== to) {
                await this.taskService.addActivity(id, {
                    type: 'statusChanged',
                    details: { from, to },
                });
            }
        } catch {}
        res.json({ ok: true, task: updated });
    }
}
