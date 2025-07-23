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
            icon: `<svg class="w-6 h-6 text-discord-white/60 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a2 2 0 10-2-2V7a2 2 0 10-2-2 2 2 0 100 4h-2a2 2 0 100 4v3.159c0 .538-.214 1.055-.595 1.436L10 17h5z" /></svg>`,
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
