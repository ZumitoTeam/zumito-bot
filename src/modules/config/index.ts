import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { UserPanelNavigationService } from "../userPanel/services/UserPanelNavigationService";

export class ConfigModule extends Module {

    requeriments = {
        services: ['UserPanelNavigationService'],
    }

    async initialize(): Promise<void> {
        super.initialize();
        
        this.registerDashboardItem();
    }

    registerDashboardItem() {
        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerItem({
            id: 'lang',
            icon: `<svg class='w-6 h-6 text-discord-white/60 group-hover:text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' /></svg>`,
            label: 'Idioma',
            url: '/panel/:guildId/lang',
            order: 10,
            category: 'config',
            sidebar: {
                showDropdown: false,
                sections: [
                    {
                        label: 'Configuración',
                        items: [
                            {
                                label: 'Idioma',
                                url: '/panel/:guildId/lang',
                            }
                        ]
                    }
                ]
            },
        });
    }
}
