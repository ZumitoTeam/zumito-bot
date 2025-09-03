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
        let recipients = testers.filter(t => !t.approved);
        // Fallback: if no pending testers, notify all testers
        if (recipients.length === 0 && testers.length > 0) {
            recipients = testers;
        }
        // Resolve requester name from session/auth if available
        let requesterName = 'Admin';
        let requesterId = 'admin';
        try {
            const auth: any = await (this.adminAuthService as any).isLoginValid(req).catch(() => null);
            requesterId = auth?.user?.id
                || auth?.data?.discordUserData?.id
                || auth?.data?.user?.id
                || auth?.data?.discordUserId
                || req.user?.id
                || 'admin';
            requesterName = auth?.user?.name
                || auth?.data?.discordUserData?.globalName
                || auth?.data?.discordUserData?.username
                || auth?.data?.user?.name
                || auth?.data?.discordUserId
                || req.user?.name
                || 'Admin';
            // Try to resolve better name and avatar from Discord API
            if (requesterId) {
                const actor = await this.client.users.fetch(String(requesterId)).catch(() => null as any);
                if (actor) {
                    requesterName = actor.globalName || actor.username || requesterName;
                    const av = typeof actor.displayAvatarURL === 'function' ? actor.displayAvatarURL({ forceStatic: true, size: 64 }) : null;
                    (req as any)._requesterAvatar = av;
                }
            }
        } catch {}
        let sent = 0;
        let failed = 0;
        for (const t of recipients) {
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
                    sent++;
                } else {
                    failed++;
                }
            } catch { failed++; }
        }
        try {
            await this.taskService.addActivity(String(id), {
                type: 'reviewRequested',
                user: { id: requesterId, name: requesterName, avatar: (req as any)._requesterAvatar || null },
                details: { total: recipients.length, sent, failed, testers: recipients.map(p => ({ id: p.id, name: p.name })) }
            });
        } catch {}
        res.json({ ok: true, count: recipients.length, sent, failed });
    }
}
