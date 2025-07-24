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
        navigationService.registerSubItems('dashboard', 'General', [
            { id: 'calls', label: 'Calls', url: '/panel/:guildId/calls' }
        ]);
    }
}
