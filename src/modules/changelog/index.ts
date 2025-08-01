
import { Module, ServiceContainer } from "zumito-framework";
import { UserPanelNavigationService } from "@zumito-team/user-panel-module/services/UserPanelNavigationService";

export class UserGitLogModule extends Module {

    constructor(modulePath: string) {
        super(modulePath);
    }

    async initialize(): Promise<void> {
        await super.initialize();

        this.registerNavigationItems();
    }

    private registerNavigationItems() {
        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerSubItems('dashboard', 'general', [{
            id: 'changelog',
            label: 'changelog.sidebarTitle',
            url: '/panel/:guildId/gitlog',
        }]);
    }
}
