import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { UserPanelNavigationService } from "../userPanel/services/UserPanelNavigationService";

export class ConfessionModule extends Module {
    requeriments = {
        services: ["UserPanelNavigationService", "UserPanelAuthService"],
    };

    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerItem({
            id: "confessions",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-message-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 20l1.921 -1.921"/><path d="M21 8a9 9 0 0 1 -9 9a9 9 0 0 1 -9 -9a9 9 0 0 1 9 -9a9 9 0 0 1 9 9"/><path d="M9 11l0 .01"/><path d="M15 11l0 .01"/></svg>`,
            label: "Confesiones",
            url: "/panel/:guildId/confessions",
            order: 30,
            category: "config",
            sidebar: {
                showDropdown: false,
                sections: [
                    {
                        label: "Configuración",
                        items: [
                            { label: "Confesiones", url: "/panel/:guildId/confessions" },
                        ],
                    },
                ],
            },
        });
    }
}

