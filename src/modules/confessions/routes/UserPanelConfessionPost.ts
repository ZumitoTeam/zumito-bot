import { Route, RouteMethod, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { Client, PermissionFlagsBits } from "zumito-framework/discord";
import { UserPanelAuthService } from "../../userPanel/services/UserPanelAuthService";

export class UserPanelConfessionPost extends Route {
    method = RouteMethod.post;
    path = '/panel/:guildId/confessions';

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
        private auth = ServiceContainer.getService(UserPanelAuthService)
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) return res.status(403).send('Access Denied');

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

        const { channelId } = req.body;
        if (!channelId) return res.status(400).send('Faltan datos');

        const ConfessionCollection = this.framework.database.collection('confession_configs');
        const config = await ConfessionCollection.findOne({ guildId });
        if (!config) {
            await ConfessionCollection.insertOne({ guildId, channelId });
        } else {
            await ConfessionCollection.updateOne({ guildId }, { $set: { channelId } });
        }
        res.redirect(`/panel/${guildId}/confessions`);
    }
}

