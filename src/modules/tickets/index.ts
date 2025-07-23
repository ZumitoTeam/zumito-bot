import { Module, ServiceContainer } from "zumito-framework";
import { UserPanelNavigationService } from "@zumito-team/user-panel-module/services/UserPanelNavigationService";

export class TicketsModule extends Module {

    constructor(modulePath: string) {
        super(modulePath);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerItem({
            id: 'tickets',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-discord-white/60 group-hover:text-white icon icon-tabler icons-tabler-outline icon-tabler-ticket"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 5l0 2" /><path d="M15 11l0 2" /><path d="M15 17l0 2" /><path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2" /></svg>`,
            label: 'Tickets',
            url: '/panel/:guildId(\\d+)/ticket',
            order: 3,
            category: 'tickets',
            sidebar: {
                showDropdown: true,
                sections: [
                    {
                        label: 'Tickets',
                        items: [
                            {
                                label: 'Panels',
                                url: '/panel/:guildId(\\d+)/ticket/panels',
                            },
                        ],
                    },
                ],
            },
        });
    }
}
