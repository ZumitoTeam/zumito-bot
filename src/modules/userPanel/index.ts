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
            id: 'userpanel',
            icon: `<svg class="w-6 h-6 text-discord-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>`,
            label: 'Panel de Usuario',
            url: '/userpanel',
            order: 1,
            category: 'general',
            sidebar: {
                showDropdown: false,
                sections: [
                    {
                        label: 'General',
                        items: [
                            { label: 'Panel', url: '/userpanel' },
                            { label: 'Configuración', url: '/userpanel/settings' },
                        ],
                    },
                ],
            },
        });
    }
}
