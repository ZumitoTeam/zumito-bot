import { Module, ServiceContainer } from "zumito-framework";
import { CommunityTranslationService } from "./services/CommunityTranslationService";
import { UserPanelNavigationService } from "@zumito-team/user-panel-module/services/UserPanelNavigationService";
import { NavigationService } from "@zumito-team/admin-module/services/NavigationService.js";

export class CommunityTranslationsModule extends Module {
    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(CommunityTranslationService, []);
    }

    async initialize(): Promise<void> {
        await super.initialize();

        try {
            const userPanelNavigationService = ServiceContainer.getService(UserPanelNavigationService);
            userPanelNavigationService.registerItem({
                id: "community-translations",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-world-search" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 12a9 9 0 1 0 -9.866 8.948" /><path d="M3.6 9h16.8" /><path d="M3.6 15h9.9" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a16.998 16.998 0 0 1 2.257 11.34" /><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>`,
                label: "Community Translations",
                url: "/panel/community-translations",
                order: 40,
                category: "config",
                sidebar: {
                    showDropdown: false,
                    sections: [
                        {
                            label: "Community Translations",
                            items: [
                                { label: "Missing Translations", url: "/panel/community-translations" }
                            ]
                        }
                    ]
                }
            });
        } catch {
            // User panel module not present
        }

        try {
            const adminNavigationService = ServiceContainer.getService(NavigationService);
            adminNavigationService.registerItem({
                id: "community-translations",
                icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-world-search" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 12a9 9 0 1 0 -9.866 8.948" /><path d="M3.6 9h16.8" /><path d="M3.6 15h9.9" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a16.998 16.998 0 0 1 2.257 11.34" /><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>`,
                label: "Community Translations",
                url: "/admin/community-translations",
                order: 100
            });
        } catch {
            // Admin module not present
        }
    }
}
