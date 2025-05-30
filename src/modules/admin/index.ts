import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { NavigationService } from "./services/NavigationService";
import { AdminAuthService } from "./services/AdminAuthService";
import { AdminViewService } from "./services/AdminViewService";

export class AdminModule extends Module {
    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);

        ServiceContainer.addService(NavigationService, [], true);
        ServiceContainer.addService(AdminAuthService, [], true);
        ServiceContainer.addService(AdminViewService, [], true);

        this.registerDashboardItem();
    }

    registerDashboardItem() {
        const navigationService = ServiceContainer.getService(NavigationService);
        navigationService.registerItem({
            id: 'test',
            icon: `<svg class="w-6 h-6 text-discord-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`,
            label: 'Dashboard',
            url: '/admin',
            order: 1,
            category: 'general',
            sidebar: {
                showDropdown: false,
                sections: [
                    {
                        label: 'General',
                        items: [
                            { label: 'Dashboard', url: '/admin' },
                            { label: 'Settings', url: '/admin/settings' },
                            { label: 'Superadmins', url: '/admin/superadmins' },
                        ],
                    },
                ],
            },
        });
    }
}