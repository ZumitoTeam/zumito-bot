import { Route, RouteMethod, ServiceContainer, TranslationManager } from "zumito-framework";
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
        // Resolve actor (admin performing the action)
        let actorId: string = 'admin';
        let actorName: string = 'Admin';
        try {
            const auth: any = await (this.adminAuthService as any).isLoginValid(req).catch(() => null);
            actorId = (auth && (auth.user?.id || auth.data?.discordUserData?.id || auth.data?.user?.id || auth.data?.discordUserId))
                || req.user?.id || req.user?.discord?.id || 'admin';
            actorName = (auth && (auth.user?.name || auth.data?.discordUserData?.globalName || auth.data?.discordUserData?.username))
                || req.user?.name || 'Admin';
        } catch {}
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
                    const tmpl = (ServiceContainer.getService(TranslationManager) as any).get?.('tasks.dm.assignedOwner')
                        || 'You have been assigned as owner/manager of a task.';
                    await user.send({ content: tmpl, components: [row] });
                }
            } catch {}
        }
        const task = await this.taskService.setOwner(String(id), ownerId ? { id: String(ownerId), name: name || String(ownerId), avatar } : null);
        try {
            // Resolve actor avatar for nicer log
            let actorAvatar: string | null = null;
            if (actorId) {
                const actor = await this.client.users.fetch(String(actorId)).catch(() => null as any);
                actorAvatar = actor && typeof actor.displayAvatarURL === 'function' ? actor.displayAvatarURL({ forceStatic: true, size: 64 }) : null;
            }
            await this.taskService.addActivity(String(id), {
                type: 'ownerAssigned',
                user: { id: actorId, name: actorName, avatar: actorAvatar },
                details: { owner: ownerId ? { id: String(ownerId), name: name || String(ownerId) } : null }
            });
        } catch {}
        res.json({ ok: true, task });
    }
}
