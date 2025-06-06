import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { UserPanelNavigationService } from "./services/UserPanelNavigationService";
import { UserPanelViewService } from "./services/UserPanelViewService";
import { UserPanelAuthService } from "./services/UserPanelAuthService";

export class UserPanelModule extends Module {
    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);

        ServiceContainer.addService(UserPanelNavigationService, [], true);
        ServiceContainer.addService(UserPanelViewService, [], true);
        ServiceContainer.addService(UserPanelAuthService, [], true);

        this.registerDashboardItem();
    }

    registerDashboardItem() {
        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerItem({
            id: 'back',
            // back arriw icon
            icon: `<svg class="w-6 h-6 text-discord-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>`,
            label: 'Cambiar de servidor',
            url: '/panel',
            order: 1,
            category: 'general',
        });
        navigationService.registerItem({
            id: 'dashboard',
            icon: `<svg class="w-6 h-6 text-discord-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m-3-7a9 9 0 100 18 9 9 0 000-18z" /></svg>`,
            label: 'Dashboard',
            url: '/panel/dashboard',
            order: 2,
            category: 'general',
            sidebar: {
                showDropdown: false,
                sections: [
                    {
                        label: 'General',
                        items: [
                            {
                                label: 'Dashboard',
                                url: '/panel/:guildId',
                            },
                            {
                                label: 'Configuración',
                                url: '/panel/:guildId/settings',
                            },
                        ],
                    },
                ],
            },
        });
    }
}
