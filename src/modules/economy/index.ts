import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { NavigationService } from "../admin/services/NavigationService";
import { EconomyService } from "./services/EconomyService";

export class EconomyModule extends Module {
    requeriments = {
        services: ["NavigationService"],
    };

    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);
        ServiceContainer.addService(EconomyService, [], true);
    }

    async initialize(): Promise<void> {
        await super.initialize();

        try {
            const navigationService = ServiceContainer.getService(NavigationService);
            navigationService.registerItem({
                id: "economy",
                icon: `<svg class="w-6 h-6 text-discord-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12c0 3.314 2.686 6 6 6s6-2.686 6-6-2.686-6-6-6-6 2.686-6 6z"/></svg>`,
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
