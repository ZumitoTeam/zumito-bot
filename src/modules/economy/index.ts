import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { NavigationService } from "@zumito-team/admin-module/services/NavigationService.js";
import { EconomyService } from "./services/EconomyService";

export class EconomyModule extends Module {
    requeriments = {
        services: ["NavigationService"],
    };

    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(EconomyService, [], true);
    }

    async initialize(): Promise<void> {
        await super.initialize();

        try {
            const navigationService = ServiceContainer.getService(NavigationService);
            navigationService.registerItem({
                id: "economy",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-discord-white/60 group-hover:text-white icon icon-tabler icons-tabler-outline icon-tabler-coin"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" /><path d="M12 7v10" /></svg>`,
                label: "Economy",
                url: "/admin/economy",
                order: 2,
                category: "general",
            });
        } catch {
            // Admin module not present
        }
    }
}
