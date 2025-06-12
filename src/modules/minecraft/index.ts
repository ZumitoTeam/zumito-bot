import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { HypixelService } from "./services/HypixelService.js";

export class MinecraftModule extends Module {
    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);
        ServiceContainer.addService(HypixelService, [], true);
    }
}
