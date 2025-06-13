import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { HypixelService } from "./services/HypixelService.js";
import { CraftingService } from "./services/CraftingService.js";

export class MinecraftModule extends Module {
    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);
        ServiceContainer.addService(HypixelService, [], true);
        ServiceContainer.addService(CraftingService, [], true);
    }
}
