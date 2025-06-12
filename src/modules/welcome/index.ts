import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { WelcomeService } from "./services/WelcomeService";

export class WelcomeModule extends Module {
    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);
        ServiceContainer.addService(WelcomeService, [], true);
    }
}
