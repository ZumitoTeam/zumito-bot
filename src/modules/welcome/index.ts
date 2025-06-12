import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { WelcomeService } from "./services/WelcomeService";
import { UserPanelNavigationService } from "../userPanel/services/UserPanelNavigationService";

export class WelcomeModule extends Module {
    requeriments = {
        services: ['UserPanelNavigationService'],
    };

    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);
        ServiceContainer.addService(WelcomeService, [], true);
    }

    async initialize(): Promise<void> {
        super.initialize();
        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerItem({
            id: 'welcome',
            icon: `<svg class="w-6 h-6 text-discord-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M12 12v.01M12 16h.01M8 12v.01M8 16h.01M16 12v.01M16 16h.01M12 20v.01M8 20v.01M16 20v.01M12 8V4m0 0H8m4 0h4"/></svg>`,
            label: 'Bienvenida',
            url: '/panel/:guildId/welcome',
            order: 20,
            category: 'config',
            sidebar: {
                showDropdown: false,
                sections: [
                    {
                        label: 'Configuración',
                        items: [
                            { label: 'Bienvenida', url: '/panel/:guildId/welcome' },
                        ],
                    },
                ],
            },
        });
    }
}
