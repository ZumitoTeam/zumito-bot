import { Module, ServiceContainer } from "zumito-framework";
import { UserPanelNavigationService } from "@zumito-team/user-panel-module/services/UserPanelNavigationService";
import { MusicService } from "./services/MusicService";

export class MusicModule extends Module {
    requeriments = {
        services: ['UserPanelNavigationService'],
    };

    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(MusicService, [], true);
    }

    async initialize(): Promise<void> {
        await super.initialize();
        const navigationService = ServiceContainer.getService(UserPanelNavigationService);
        navigationService.registerSubItems('dashboard', 'general', [
            { id: 'music', label: 'music.sidebarTitle', url: '/panel/:guildId/music' },
        ]);
    }
}