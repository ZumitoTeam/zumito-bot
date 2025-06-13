import { Module, ServiceContainer, ZumitoFramework } from 'zumito-framework';
import { ReputationService } from './services/ReputationService.js';

export class ReputationModule extends Module {
    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);
        ServiceContainer.addService(ReputationService, [], true);
    }
}
