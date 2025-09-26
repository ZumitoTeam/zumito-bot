import { Module, ServiceContainer } from "zumito-framework";
import { UserPanelNavigationService } from "@zumito-team/user-panel-module/services/UserPanelNavigationService";
import { BackupImportService } from "./services/import/BackupImportService";

export class BackupModule extends Module {

    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(BackupImportService, [], true);
    }

    async initialize(): Promise<void> {
        await super.initialize();

        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerSubItems('dashboard', 'general', [{
            id: 'backup',
            label: 'backup.sidebarTitle',
            url: '/panel/:guildId/backup',
        }]);
    }
}
