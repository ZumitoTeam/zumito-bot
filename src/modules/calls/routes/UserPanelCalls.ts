import { GuildDataGetter, Route, RouteMethod, ServiceContainer, ZumitoFramework } from 'zumito-framework';
import { Client, PermissionFlagsBits } from 'zumito-framework/discord';
import { UserPanelAuthService } from '@zumito-team/user-panel-module/services/UserPanelAuthService';
import { UserPanelViewService } from '@zumito-team/user-panel-module/services/UserPanelViewService';
import ejs from 'ejs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class UserPanelCalls extends Route {
    method = RouteMethod.get;
    path = '/panel/:guildId/calls';

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private auth = ServiceContainer.getService(UserPanelAuthService),
        private guildDataGetter = ServiceContainer.getService(GuildDataGetter)
    ) { super(); }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) return res.redirect('/panel/login');

        const userId = authData.data.discordUserData.id;
        const guildId = req.params.guildId as string;
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return res.status(404).send('Servidor no encontrado');
        let member = guild.members.cache.get(userId);
        if (!member) member = await guild.members.fetch(userId).catch(() => null);
        if (!member || !(member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ManageGuild) || guild.ownerId === userId)) {
            return res.status(403).send('No tienes permisos en este servidor');
        }
        const guildSettings = await this.guildDataGetter.getGuildSettings(guildId);
        const categories = guild.channels.cache.filter(c => c.type === 4).map(c => ({ id: c.id, name: (c as any).name }));
        const content = await ejs.renderFile(
            path.resolve(__dirname, '../views/calls-config.ejs'),
            { guild, guildSettings, categories, botName: this.client.user?.username || 'Zumito Bot' }
        );
        const view = new UserPanelViewService();
        const html = await view.render({ content, reqPath: req.path, req, res });
        res.send(html);
    }
}
