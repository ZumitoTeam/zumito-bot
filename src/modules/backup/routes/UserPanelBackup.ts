import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { UserPanelAuthService } from "@zumito-team/user-panel-module/services/UserPanelAuthService";
import { UserPanelViewService } from "@zumito-team/user-panel-module/services/UserPanelViewService";
import { UserPanelLanguageManager } from "@zumito-team/user-panel-module/services/UserPanelLanguageManager";
import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Client, PermissionFlagsBits } from "zumito-framework/discord";

const __dirname = dirname(fileURLToPath(import.meta.url));

export class UserPanelBackup extends Route {
    method = RouteMethod.get;
    path = "/panel/:guildId/backup";

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private auth = ServiceContainer.getService(UserPanelAuthService),
        private userPanelLanguageManager = ServiceContainer.getService(UserPanelLanguageManager),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) {
            return res.redirect("/panel/login");
        }

        const languageVariables = this.userPanelLanguageManager.getLanguageVariables(req, res);
        const { t } = languageVariables;

        const userId = authData.data.discordUserData.id;
        const guildId = req.params.guildId as string;
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) {
            return res.status(404).send(t("backup.errors.guildNotFound"));
        }

        let member = guild.members.cache.get(userId);
        if (!member) {
            member = await guild.members.fetch(userId).catch(() => null);
        }

        if (!member || !(member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ManageGuild) || guild.ownerId === userId)) {
            return res.status(403).send(t("backup.errors.missingPermissions"));
        }

        const content = await ejs.renderFile(
            path.resolve(__dirname, "../views/backup.ejs"),
            {
                guild,
                feedback: this.buildFeedback(req),
                ...languageVariables,
            }
        );

        const view = new UserPanelViewService();
        const html = await view.render({ content, reqPath: req.path, req, res });
        res.send(html);
    }

    private buildFeedback(req: any) {
        const { status, reason, createdRoles, updatedRoles, createdCategories, createdChannels } = req.query || {};
        const normalizedStatus = status === "success" || status === "error" ? status : null;
        if (!normalizedStatus) return null;
        const safeReason = typeof reason === "string" ? reason : undefined;

        const toNumber = (value: unknown): number | undefined => {
            if (typeof value !== "string") return undefined;
            const parsed = Number(value);
            return Number.isNaN(parsed) ? undefined : parsed;
        };

        return {
            status: normalizedStatus,
            reason: safeReason,
            createdRoles: toNumber(createdRoles),
            updatedRoles: toNumber(updatedRoles),
            createdCategories: toNumber(createdCategories),
            createdChannels: toNumber(createdChannels),
        };
    }
}
