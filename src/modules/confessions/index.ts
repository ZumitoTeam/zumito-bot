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
            icon: `<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 128 128" x="0px" y="0px" fill="currentColor"><path d="M.7,14.4a2,2,0,0,0,1.93.81l4-.62,3,2.85A2,2,0,0,0,13,16.23l.43-3.72,3.47-1.64a2,2,0,0,0,0-3.61L13.14,5.48l-.72-3.85A2,2,0,0,0,9,.6L6.35,3.31l-4-.7a2,2,0,0,0-2.08,3L2.25,9,.54,12.32A2,2,0,0,0,.7,14.4Z" fill="currentColor"/><path d="M27.86,26.41a2,2,0,0,0,2,.66l3.81-1,2.75,2.53a2,2,0,0,0,3.34-1.24l.47-4,3.54-2.09a2,2,0,0,0-.27-3.58l-3.47-1.41-.65-3.78a2,2,0,0,0-3.48-1l-2.71,3.11-3.9-.34a2,2,0,0,0-1.91,3l1.9,3.31L27.6,24.28A2,2,0,0,0,27.86,26.41Z" fill="currentColor"/><path d="M88.84,38H89a2,2,0,0,0,2-1.87C91.45,29,86.14,26.4,83.27,26A2,2,0,0,0,81,27.72,2,2,0,0,0,82.72,30c.77.12,4.59.95,4.26,5.89A2,2,0,0,0,88.84,38Z" fill="currentColor"/><circle cx="17" cy="40" r="7" fill="currentColor"/><path d="M2,128H62a2,2,0,0,0,2-2V57.31l.37.23c.06,0,6.49,4.07,9.28,6.27L74,64C70.5,66.88,64.56,72.5,65,77a2,2,0,0,0,0,.24c.6,2.62,2.75,7,7,6.88a2,2,0,0,0,1.14-.41c1.25-.94,3.55-2.05,4.78-1.63a7.2,7.2,0,0,1,1.81,6.57c-.08.58-1.9,14.16,5.44,20.38A13.1,13.1,0,0,0,94,112a26.15,26.15,0,0,0,7.76-1.33l.23-.09c.07,0,7.44-3.36,13.05-2.33l.33,0c.29,0,7.13.1,11.52-2a2,2,0,0,0-1.75-3.6c-3.21,1.56-8.57,1.64-9.56,1.64-6.43-1.1-14,2.12-15.14,2.6-5.61,1.74-9.86,1.43-12.62-.9-5.66-4.79-4.09-16.66-4.08-16.71a11,11,0,0,0-3.42-10.46,2.06,2.06,0,0,0-.32-.21C76.81,77,73,79,71.44,80.05c-1.46-.44-2.28-3-2.45-3.6-.05-2.3,4.62-7.23,9.16-10.67a9.2,9.2,0,0,0,1.91.21,7.81,7.81,0,0,0,1.25-.1A2,2,0,0,0,80.68,62a7.44,7.44,0,0,1-4.62-1.34c-2.89-2.28-9.29-6.3-9.65-6.52-1.47-.83-2-2.23-1.46-4.18C68,49,80,40,80.64,39.15a2,2,0,0,0-.49-2.78l-3.06-2.14-.1-.07C70.81,30.39,66,29.34,62.7,31a6.69,6.69,0,0,0-2.95,3.09c-2.62-2.58-3.59-5.45-1.88-9.28A62.65,62.65,0,0,1,63,17c.77-1.07,1.49-2.06,2.06-2.9A77.17,77.17,0,0,0,71.55,2.81a2,2,0,0,0-3.66-1.62,74.1,74.1,0,0,1-6.08,10.63c-.56.82-1.26,1.79-2,2.83a62.49,62.49,0,0,0-5.57,8.57c-4.89,10.9,5.8,16.71,12.9,20.56a9.55,9.55,0,0,1-3.44,2.35,3.23,3.23,0,0,0-1,.43A12,12,0,0,0,40,52v49.08a12,12,0,0,0-20,8.85v3.15A12,12,0,0,0,0,121.9V126A2,2,0,0,0,2,128Z" fill="currentColor"/></svg>`,
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
