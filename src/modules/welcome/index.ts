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
        await super.initialize();
        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerItem({
            id: 'welcome',
            icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-door-enter"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 12v.01" /><path d="M3 21h18" /><path d="M5 21v-16a2 2 0 0 1 2 -2h6m4 10.5v7.5" /><path d="M21 7h-7m3 -3l-3 3l3 3" /></svg>`,
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
