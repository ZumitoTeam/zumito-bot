import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { EconomyService } from "./services/EconomyService";

export class EconomyModule extends Module {
    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);
        ServiceContainer.addService(EconomyService, [], true);
    }
}
