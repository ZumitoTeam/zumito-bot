import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { Client, PermissionFlagsBits } from "zumito-framework/discord";
import { UserPanelAuthService } from "@zumito-team/user-panel-module/services/UserPanelAuthService";

export class UserPanelLangPost extends Route {
    method = RouteMethod.post;
    path = '/panel/:guildId/lang';

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private auth = ServiceContainer.getService(UserPanelAuthService),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) return res.status(403).send('Access Denied');

        const userId = authData.data.discordUserData.id;
        const guildId = req.params.guildId as string;
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return res.status(404).send('Servidor no encontrado');
        let member = guild.members.cache.get(userId);
        if (!member) member = await guild.members.fetch(userId).catch(() => null);
        if (!member || !(member.permissions.has(PermissionFlagsBits.Administrator) ||
            member.permissions.has(PermissionFlagsBits.ManageGuild) || guild.ownerId === userId)) {
            return res.status(403).send('No tienes permisos en este servidor');
        }

        const { lang } = req.body || {};
        if (!lang || !['en', 'es'].includes(lang)) return res.status(400).send('Idioma inválido');

        await this.framework.database.collection('guilds').updateOne(
            { guildId },
            { $set: { lang } },
            { upsert: true }
        );

        res.redirect(`/panel/${guildId}/lang`);
    }
}
