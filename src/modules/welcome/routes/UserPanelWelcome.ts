import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { Client, PermissionFlagsBits } from "zumito-framework/discord";
import { UserPanelAuthService } from "@zumito-team/user-panel-module/services/UserPanelAuthService";
import { UserPanelViewService } from "@zumito-team/user-panel-module/services/UserPanelViewService";
import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class UserPanelWelcome extends Route {
    method = RouteMethod.get;
    path = '/panel/:guildId/welcome';

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private auth = ServiceContainer.getService(UserPanelAuthService)
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) {
            return res.redirect('/panel/login');
        }

        const userId = authData.data.discordUserData.id;
        const guildId = req.params.guildId;
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return res.status(404).send('Servidor no encontrado');
        let member = guild.members.cache.get(userId);
        if (!member) {
            member = await guild.members.fetch(userId).catch(() => null);
        }
        if (!member || !(member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ManageGuild) || guild.ownerId === userId)) {
            return res.status(403).send('No tienes permisos en este servidor');
        }

        const WelcomeCollection = this.framework.database.collection('welcome_configs');
        let config = await WelcomeCollection.findOne({ guildId }).catch(() => null);
        if (!config) {
            await WelcomeCollection.insertOne({
                guildId,
                channelId: null,
                message: '¡Bienvenido al servidor!',
                enabled: false
            });
            config = await WelcomeCollection.findOne({ guildId });
        }
        const channels = guild.channels.cache
            .filter(c => c.isTextBased())
            .map(c => ({ id: c.id, name: (c as any).name }));

        const content = await ejs.renderFile(
            path.resolve(__dirname, '../views/welcome-config.ejs'),
            { guild, config, channels, 
                botName: this.client.user?.username || 'Zumito Bot',
             }
        );
        const view = new UserPanelViewService();
        const html = await view.render({ content, reqPath: req.path, req, res });
        res.send(html);
    }
}
