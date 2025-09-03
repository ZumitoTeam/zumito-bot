import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { AdminAuthService } from "@zumito-team/admin-module/services/AdminAuthService";
import { Client, GuildMember } from "discord.js";

export class AdminTasksApiUserSearch extends Route {
    method = RouteMethod.get;
    path = '/admin/tasks/api/users';

    constructor(
        private adminAuthService: AdminAuthService = ServiceContainer.getService(AdminAuthService),
        private client: Client = ServiceContainer.getService(Client),
    ) { super(); }

    async execute(req: any, res: any) {
        if (!this.adminAuthService.isLoginValid(req)) return;
        const q = String(req.query.q || '').toLowerCase();
        if (!q || q.length < 2) return res.json({ ok: true, users: [] });

        const results: { id: string; name: string; avatar?: string | null }[] = [];
        const seen = new Set<string>();

        // Search user cache
        this.client.users.cache.forEach(u => {
            const name = (u.globalName || u.username || '').toLowerCase();
            if (!name) return;
            if (name.includes(q)) {
                if (!seen.has(u.id)) {
                    seen.add(u.id);
                    const avatar = typeof u.displayAvatarURL === 'function' ? u.displayAvatarURL({ forceStatic: true, size: 64 }) : null;
                    results.push({ id: u.id, name: u.globalName || u.username, avatar });
                }
            }
        });

        // Search member caches across guilds (no fetch)
        this.client.guilds.cache.forEach(g => {
            g.members.cache.forEach((m: GuildMember) => {
                const name = (m.displayName || m.user.globalName || m.user.username || '').toLowerCase();
                if (!name) return;
                if (name.includes(q)) {
                    if (!seen.has(m.id)) {
                        seen.add(m.id);
                        const avatar = typeof m.user.displayAvatarURL === 'function' ? m.user.displayAvatarURL({ forceStatic: true, size: 64 }) : null;
                        results.push({ id: m.id, name: m.displayName || m.user.globalName || m.user.username, avatar });
                    }
                }
            });
        });

        res.json({ ok: true, users: results.slice(0, 20) });
    }
}
