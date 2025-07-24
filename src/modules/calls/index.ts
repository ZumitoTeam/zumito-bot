import { Module, ServiceContainer } from 'zumito-framework';
import { UserPanelNavigationService } from '@zumito-team/user-panel-module/services/UserPanelNavigationService';
import { CallService } from './services/CallService.js';

export class CallModule extends Module {
    requeriments = {
        services: ['UserPanelNavigationService']
    };

    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(CallService, [], true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerItem({
            id: 'calls',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-phone"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4h5l5 5v6l-5 5h-5z"/></svg>`,
            label: 'Calls',
            url: '/panel/:guildId/calls',
            order: 30,
            category: 'config',
            sidebar: {
                showDropdown: false,
                sections: [
                    {
                        label: 'Configuration',
                        items: [{ label: 'Calls', url: '/panel/:guildId/calls' }]
                    }
                ]
            }
        });
    }
}
