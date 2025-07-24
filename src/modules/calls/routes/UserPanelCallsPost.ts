import { GuildDataGetter, Route, RouteMethod, ServiceContainer, ZumitoFramework } from 'zumito-framework';
import { Client, PermissionFlagsBits } from 'zumito-framework/discord';
import { UserPanelAuthService } from '@zumito-team/user-panel-module/services/UserPanelAuthService';

export class UserPanelCallsPost extends Route {
    method = RouteMethod.post;
    path = '/panel/:guildId/calls';

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private auth = ServiceContainer.getService(UserPanelAuthService),
        private guildDataGetter = ServiceContainer.getService(GuildDataGetter)
    ) { super(); }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) return res.status(403).send('Access Denied');

        const userId = authData.data.discordUserData.id;
        const guildId = req.params.guildId as string;
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return res.status(404).send('Servidor no encontrado');
        let member = guild.members.cache.get(userId);
        if (!member) member = await guild.members.fetch(userId).catch(() => null);
        if (!member || !(member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ManageGuild) || guild.ownerId === userId)) {
            return res.status(403).send('No tienes permisos en este servidor');
        }
        const { categoryId } = req.body;
        if (!categoryId) return res.status(400).send('Faltan datos');

        this.framework.database.collection('guilds').updateOne(
            { guild_id: guildId },
            { $set: { callCategoryId: categoryId } },
            { upsert: true }
        ).catch(() => res.status(500).send('Error updating call category'));
        res.redirect(`/panel/${guildId}/calls`);
    }
}
