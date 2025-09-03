import { Module, ServiceContainer } from "zumito-framework";
import { BirthdayService } from "./services/BirthdayService";
import { UserPanelNavigationService } from "@zumito-team/user-panel-module/services/UserPanelNavigationService";

export class BirthdaysModule extends Module {
    requeriments = {
        services: ["UserPanelNavigationService"],
    };

    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(BirthdayService, [], true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        // Register navigation in User Panel (if available in this context)
        try {
            const navigationService = ServiceContainer.getService(UserPanelNavigationService);
            navigationService.registerItem({
                id: 'birthdays',
                icon: `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"icon icon-tabler icons-tabler-outline icon-tabler-confetti\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M4 5l7 7m0 0l-3 3m3 -3l3 3\" /><path d=\"M10 3l1.5 1.5\" /><path d=\"M20 14l-1.5 1.5\" /><path d=\"M14 20l-1.5 -1.5\" /><path d=\"M3 10l1.5 -1.5\" /></svg>`,
                label: 'Cumpleaños',
                url: '/panel/:guildId/birthdays',
                order: 21,
                category: 'config',
                sidebar: {
                    showDropdown: false,
                    sections: [
                        {
                            label: 'Configuración',
                            items: [
                                { label: 'Cumpleaños', url: '/panel/:guildId/birthdays' },
                            ],
                        },
                    ],
                },
            });
        } catch {
            // User Panel module may not be available in all contexts
        }

        // Start daily scheduler
        const svc = ServiceContainer.getService(BirthdayService) as BirthdayService;
        svc.startScheduler();
    }
}

