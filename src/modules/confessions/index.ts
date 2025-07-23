import { Module, ServiceContainer, ZumitoFramework } from 'zumito-framework';
import { UserPanelNavigationService } from '@zumito-team/user-panel-module/services/UserPanelNavigationService';
import { ConfessionService } from './services/ConfessionService.js';

export class ConfessionModule extends Module {
    requeriments = {
        services: ['UserPanelNavigationService']
    };

    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);
        ServiceContainer.addService(ConfessionService, [], true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerItem({
            id: 'confessions',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icon-tabler-message-circle-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 9 -9a9 9 0 0 0 -9 9"/><path d="M3 12v6l4 -4h8a3 3 0 0 0 3 -3v-1" /></svg>`,
            label: 'Confesiones',
            url: '/panel/:guildId/confessions',
            order: 30,
            category: 'config',
            sidebar: {
                showDropdown: false,
                sections: [
                    {
                        label: 'Configuración',
                        items: [
                            { label: 'Confesiones', url: '/panel/:guildId/confessions' }
                        ]
                    }
                ]
            }
        });
    }
}
