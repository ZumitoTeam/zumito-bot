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
        // Try to enrich actor name from Discord profile
        try {
            if (actorId && actorName === 'Admin') {
                const actor = await this.client.users.fetch(String(actorId)).catch(() => null as any);
                if (actor) {
                    actorName = actor.globalName || actor.username || actorName;
                }
            }
        } catch {}
        // Prepare DM info (we will send after we know task title)
        let dmUser: any = null;
        let dmRow: any = null;
        try {
            const user = await this.client.users.fetch(String(testerId)).catch(() => null);
            if (user) {
                dmUser = user;
                name = name || (user.globalName || user.username);
                avatar = typeof user.displayAvatarURL === 'function' ? user.displayAvatarURL({ forceStatic: true, size: 128 }) : null;
                const base = (req.protocol && req.get) ? `${req.protocol}://${req.get('host')}` : '';
                const link = `${base}/admin/tasks/kanban?t=${encodeURIComponent(taskId)}`;
                dmRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(link).setLabel(this.translationService.get('tasks.action.openTask') || 'Open Task')
                );
            }
        } catch {}
        // Merge tester into existing list instead of overwriting
        let updated = await (this.taskService as any)["col"]().findOne({ id: taskId }).catch(() => null as any);
        const testers = Array.isArray(updated?.testers) ? updated.testers : [];
        const idx = testers.findIndex((t: any) => String(t.id) === String(testerId));
        const entry = { id: String(testerId), name: name || String(testerId), avatar, approved: false } as any;
        if (idx >= 0) testers[idx] = { ...testers[idx], ...entry };
        else testers.push(entry);
        updated = await this.taskService.update(taskId, { testers } as any);
        // Send DM with actor and task title
        try {
            const taskTitle = (updated && updated.title) || (typeof id === 'string' ? id : String(id));
            if (dmUser && dmRow) {
                const tmpl = this.translationService.get('tasks.dm.assignedTester')
                    || 'You have been added as a tester by {actor} for task: {task}';
                const content = String(tmpl)
                    .replace('{actor}', actorName)
                    .replace('{task}', taskTitle);
                await dmUser.send({ content, components: [dmRow] });
            }
        } catch {}
        try {
            // Resolve actor avatar for nicer log
            let actorAvatar: string | null = null;
            if (actorId) {
                const actor = await this.client.users.fetch(String(actorId)).catch(() => null as any);
                actorAvatar = actor && typeof actor.displayAvatarURL === 'function' ? actor.displayAvatarURL({ forceStatic: true, size: 64 }) : null;
            }
            await this.taskService.addActivity(taskId, {
                type: 'testerAdded',
                user: { id: actorId, name: actorName, avatar: actorAvatar },
                details: { tester: { id: String(testerId), name: name || String(testerId) } }
            });
        } catch {}
        res.json({ ok: true, task: updated });
    }
}
