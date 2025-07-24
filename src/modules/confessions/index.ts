import { Module, ServiceContainer, ZumitoFramework } from 'zumito-framework';
import { UserPanelNavigationService } from '@zumito-team/user-panel-module/services/UserPanelNavigationService';
import { ConfessionService } from './services/ConfessionService.js';

export class ConfessionModule extends Module {
    requeriments = {
        services: ['UserPanelNavigationService']
    };

    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(ConfessionService, [], true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerSubItems('dashboard', 'general', [
            { id: 'confessions', label: 'Confesiones', url: '/panel/:guildId/confessions' }
        ]);
    }
}
