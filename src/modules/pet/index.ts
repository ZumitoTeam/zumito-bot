import { Module, ServiceContainer } from 'zumito-framework';
import { PetService } from './services/PetService';

export class PetModule extends Module {
    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(PetService, [], true);
    }
}
