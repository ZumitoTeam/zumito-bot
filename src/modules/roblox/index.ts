import { Module, ServiceContainer } from 'zumito-framework';
import { RobloxService } from './services/RobloxService.js';

export class RobloxModule extends Module {
    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(RobloxService, [], true);
    }
}
