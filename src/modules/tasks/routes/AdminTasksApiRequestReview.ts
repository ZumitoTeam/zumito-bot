import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { TaskItem, TaskService } from "../services/TaskService";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client } from "discord.js";
import { TranslationManager } from "zumito-framework";

export class AdminTasksApiRequestReview extends Route {
    method = RouteMethod.post;
    path = '/admin/tasks/api/request-review';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private taskService: TaskService = ServiceContainer.getService(TaskService),
        private client: Client = ServiceContainer.getService(Client),
        private translationService: TranslationManager = ServiceContainer.getService(TranslationManager),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;
        const { id, message } = req.body || {};
        if (!id) return res.status(400).json({ ok: false, error: 'Missing id' });
        const now = Date.now();
        const task = await this.taskService.update(String(id), { } as Partial<TaskItem>);
        await (ServiceContainer.getService(TaskService) as TaskService)["col"]().updateOne({ id: String(id) }, { $set: { lastReviewRequestAt: now } });
        const testers = task?.testers || [];
        const pending = testers.filter(t => !t.approved);
        // Resolve requester name from session/auth if available
        let requesterName = 'Admin';
        try {
            const auth: any = await (this.adminAuthService as any).isLoginValid(req).catch(() => null);
            requesterName = auth?.user?.name
                || auth?.data?.discordUserData?.globalName
                || auth?.data?.discordUserData?.username
                || auth?.data?.user?.name
                || auth?.data?.discordUserId
                || req.user?.name
                || 'Admin';
        } catch {}
        for (const t of pending) {
            try {
                const user = await this.client.users.fetch(String(t.id)).catch(() => null);
                if (user) {
                    const base = (req.protocol && req.get) ? `${req.protocol}://${req.get('host')}` : '';
                    const link = `${base}/admin/tasks/kanban?t=${encodeURIComponent(String(id))}`;
                    const row: any = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(link).setLabel(this.translationService.get('tasks.action.openTask') || 'Open Task')
                    );
                    const fallback = `Please review task: ${task?.title || id}`;
                    const tmpl = this.translationService.get('tasks.dm.requestReview') || fallback;
                    const content = (message || String(tmpl)
                        .replace('{requester}', String(requesterName))
                        .replace('{task}', String(task?.title || id)));
                    await user.send({ content, components: [row] });
                }
            } catch {}
        }
        res.json({ ok: true, count: pending.length });
    }
}
