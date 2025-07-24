import { Module, ZumitoFramework, ServiceContainer } from "zumito-framework";
import { ModerationService } from "./services/ModerationService";

export class ModerationModule extends Module {
    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(ModerationService, [], true);
    }
}
