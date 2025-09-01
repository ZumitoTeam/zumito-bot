import { Module, ServiceContainer } from "zumito-framework";
import { AutoRoleService } from "./services/AutoRoleService";
import { UserPanelNavigationService } from "@zumito-team/user-panel-module/services/UserPanelNavigationService";

export class AutorolesModule extends Module {
    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(AutoRoleService, [], true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerItem({
            id: "autoroles",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-user-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 19v-2a4 4 0 0 0 -4 -4h-4a4 4 0 0 0 -4 4v2" /><path d="M8 7a4 4 0 1 0 0 -8a4 4 0 0 0 0 8" /><path d="M16 11l2 2l4 -4" /></svg>`,
            label: "Auto Roles",
            url: "/panel/:guildId/autoroles",
            order: 30,
            category: "config",
            sidebar: {
                showDropdown: false,
                sections: [
                    {
                        label: "Configuration",
                        items: [
                            { label: "Auto Roles", url: "/panel/:guildId/autoroles" }
                        ]
                    }
                ]
            }
        });
    }
}
