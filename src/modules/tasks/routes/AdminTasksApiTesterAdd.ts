import { Route, RouteMethod, ServiceContainer, TranslationManager } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { TaskService } from "../services/TaskService";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client } from "discord.js";

export class AdminTasksApiTesterAdd extends Route {
    method = RouteMethod.post;
    path = '/admin/tasks/api/tester/add';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private taskService: TaskService = ServiceContainer.getService(TaskService),
        private client: Client = ServiceContainer.getService(Client),
        private translationService: TranslationManager = ServiceContainer.getService(TranslationManager),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;
        const { id, testerId, testerName } = req.body || {};
        if (!id || !testerId) return res.status(400).json({ ok: false, error: 'Missing fields' });
        const taskId = String(id);
        let name = String(testerName || '');
        let avatar: string | null = null;
        // Try to resolve user info and DM
        try {
            const user = await this.client.users.fetch(String(testerId)).catch(() => null);
            if (user) {
                name = name || (user.globalName || user.username);
                avatar = typeof user.displayAvatarURL === 'function' ? user.displayAvatarURL({ forceStatic: true, size: 128 }) : null;
                const base = (req.protocol && req.get) ? `${req.protocol}://${req.get('host')}` : '';
                const link = `${base}/admin/tasks/kanban?t=${encodeURIComponent(taskId)}`;
                const row: any = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(link).setLabel(this.translationService.get('tasks.action.openTask') || 'Open Task')
                );
                await user.send({ content: `You have been added as a tester.`, components: [row] });
            }
        } catch {}
        const updated = await this.taskService.update(taskId, { testers: [{ id: String(testerId), name: name || String(testerId), avatar, approved: false }] });
        res.json({ ok: true, task: updated });
    }
}
