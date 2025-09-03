import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { TaskService } from "../services/TaskService";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client } from "discord.js";

export class AdminTasksApiAssignOwner extends Route {
    method = RouteMethod.post;
    path = '/admin/tasks/api/assign';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private taskService: TaskService = ServiceContainer.getService(TaskService),
        private client: Client = ServiceContainer.getService(Client),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;
        const { id, ownerId, ownerName } = req.body || {};
        if (!id) return res.status(400).json({ ok: false, error: 'Missing id' });
        let name = ownerName ? String(ownerName) : '';
        let avatar: string | null = null;
        if (ownerId) {
            try {
                const user = await this.client.users.fetch(String(ownerId)).catch(() => null);
                if (user) {
                    name = name || (user.globalName || user.username);
                    avatar = typeof user.displayAvatarURL === 'function' ? user.displayAvatarURL({ forceStatic: true, size: 128 }) : null;
                    const base = (req.protocol && req.get) ? `${req.protocol}://${req.get('host')}` : '';
                    const link = `${base}/admin/tasks/kanban?t=${encodeURIComponent(String(id))}`;
                    const row: any = new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(link).setLabel('Open Task')
                    );
                    await user.send({ content: `You have been assigned as owner/manager of a task.`, components: [row] });
                }
            } catch {}
        }
        const task = await this.taskService.setOwner(String(id), ownerId ? { id: String(ownerId), name: name || String(ownerId), avatar } : null);
        res.json({ ok: true, task });
    }
}
