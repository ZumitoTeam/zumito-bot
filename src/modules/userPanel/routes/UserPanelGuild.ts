import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import ejs from 'ejs';
import { Client } from "zumito-framework/discord";
import { UserPanelViewService } from "../services/UserPanelViewService";
import { UserPanelAuthService } from "../services/UserPanelAuthService";
import { PermissionFlagsBits } from "discord.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class UserPanelGuild extends Route {
    method = RouteMethod.get;
    path = '/panel/:guildId';

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private userPanelAuthService = ServiceContainer.getService(UserPanelAuthService),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const authData = await this.userPanelAuthService.isLoginValid(req);
        if (!authData.isValid) {
            return res.redirect('/panel/login');
        }
        const userId = authData.data.discordUserData.id;;
        const guildId = req.params.guildId;
        const client = this.client;
        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(404).send('Servidor no encontrado');
        const member = guild.members.cache.get(userId);
        if (!member || !(member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ManageGuild) || guild.ownerId === userId)) {
            console.log('Member:', member);
            console.log('Member Admin Permissions:', member?.permissions.has(PermissionFlagsBits.Administrator));
            console.log('Member Manage Guild Permissions:', member?.permissions.has(PermissionFlagsBits.ManageGuild));
            console.log('Guild Owner ID:', guild.ownerId);
            console.log('User ID:', userId);
            return res.status(403).send('No tienes permisos en este servidor');
        }
        // Renderizar vista específica del servidor
        const content = await ejs.renderFile(
            path.resolve(__dirname, '../views/guild.ejs'),
            {
                guild: {
                    id: guild.id,
                    name: guild.name,
                    icon: guild.iconURL?.() || '',
                    isOwner: guild.ownerId === userId
                },
                member: {
                    id: member.id,
                    username: member.user?.username,
                    avatar: member.user?.avatarURL?.() || ''
                }
            }
        );
        const userPanelView = new UserPanelViewService();
        const html = await userPanelView.render({
            content,
            reqPath: this.path,
            req, res,
        });
        res.send(html);
    }
}
