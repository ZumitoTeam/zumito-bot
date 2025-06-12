import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { UserPanelNavigationService } from "./services/UserPanelNavigationService";
import { UserPanelViewService } from "./services/UserPanelViewService";
import { UserPanelAuthService } from "./services/UserPanelAuthService";

export class UserPanelModule extends Module {
    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);

        //ServiceContainer.addService(UserPanelNavigationService, [], true);
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
            icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-layout-dashboard"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 3a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zm0 12a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2zm10 -4a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zm0 -8a2 2 0 0 1 2 2v2a2 2 0 0 1 -2 2h-4a2 2 0 0 1 -2 -2v-2a2 2 0 0 1 2 -2z" /></svg>`,
            label: 'Dashboard',
            url: '/panel/:guildId(\\d+)',
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
                                url: '/panel/:guildId(\\d+)',
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
