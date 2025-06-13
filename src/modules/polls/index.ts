import { Module, ServiceContainer } from 'zumito-framework';
import { PollService } from './services/PollService.js';

export class PollModule extends Module {
    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(PollService, [], true);
    }
}
