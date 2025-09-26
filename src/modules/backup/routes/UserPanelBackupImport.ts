import { Route, RouteMethod, ServiceContainer } from "zumito-framework";
import { UserPanelAuthService } from "@zumito-team/user-panel-module/services/UserPanelAuthService";
import { Client, PermissionFlagsBits } from "zumito-framework/discord";
import { BackupImportService, BackupImportType, BackupImportError } from "../services/import/BackupImportService";

export class UserPanelBackupImport extends Route {
    method = RouteMethod.post;
    path = "/panel/:guildId/backup";

    constructor(
        private client: Client = ServiceContainer.getService(Client),
        private auth = ServiceContainer.getService(UserPanelAuthService),
        private backupImportService: BackupImportService = ServiceContainer.getService(BackupImportService),
    ) {
        super();
    }

    async execute(req: any, res: any) {
        const authData = await this.auth.isLoginValid(req);
        if (!authData.isValid) {
            return res.redirect("/panel/login");
        }

        const userId = authData.data.discordUserData.id;
        const guildId = req.params.guildId as string;
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) {
            return this.redirectWithError(res, guildId, "guildNotFound");
        }

        let member = guild.members.cache.get(userId);
        if (!member) {
            member = await guild.members.fetch(userId).catch(() => null);
        }

        if (!member || !(member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ManageGuild) || guild.ownerId === userId)) {
            return this.redirectWithError(res, guildId, "missingPermissions");
        }

        const { importType, rawData } = req.body || {};
        const type = importType as BackupImportType;
        if (type !== "roles" && type !== "channels" && type !== "full") {
            return this.redirectWithError(res, guildId, "invalidType");
        }

        if (!rawData || typeof rawData !== "string") {
            return this.redirectWithError(res, guildId, "missingData");
        }

        let parsed: unknown;
        try {
            parsed = JSON.parse(rawData);
        } catch {
            return this.redirectWithError(res, guildId, "invalidJson");
        }

        try {
            const result = await this.backupImportService.importFromJson(guildId, type, parsed);
            const params = new URLSearchParams({
                status: "success",
                createdRoles: String(result.createdRoles ?? 0),
                updatedRoles: String(result.updatedRoles ?? 0),
                createdCategories: String(result.createdCategories ?? 0),
                createdChannels: String(result.createdChannels ?? 0),
            });
            return res.redirect(`/panel/${guildId}/backup?${params.toString()}`);
        } catch (error) {
            if (error instanceof BackupImportError) {
                return this.redirectWithError(res, guildId, error.code);
            }
            return this.redirectWithError(res, guildId, "unknownError");
        }
    }

    private redirectWithError(res: any, guildId: string, reason: string) {
        const params = new URLSearchParams({ status: "error", reason });
        return res.redirect(`/panel/${guildId}/backup?${params.toString()}`);
    }
}
