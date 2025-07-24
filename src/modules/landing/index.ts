import { Module, ServiceContainer } from "zumito-framework";
import { NavigationService } from "@zumito-team/admin-module/services/NavigationService.js";
import { LandingViewService } from "./services/LandingViewService";

export class LandingModule extends Module {
    requeriments = {
        services: ["NavigationService"],
    };

    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(LandingViewService, [], true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        try {
            const navigationService = ServiceContainer.getService(NavigationService);
            navigationService.registerItem({
                id: 'landing',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-discord-white/60 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h18v2H3zM3 11h18v2H3zM3 17h18v2H3z"/></svg>`,
                label: 'Landing',
                url: '/admin/landing/modules',
                order: 2,
                category: 'general',
                sidebar: {
                    showDropdown: false,
                    sections: [
                        {
                            id: 'landing',
                            label: 'Landing',
                            items: [ 
                                { label: 'Modules', url: '/admin/landing/modules' },
                                { label: 'Featured Commands', url: '/admin/landing/featured-commands' },
                                { label: 'Theme', url: '/admin/landing/theme' },
                            ],
                        },
                    ],
                },
            });
        } catch {
            // admin module not available
        }
    }
}
