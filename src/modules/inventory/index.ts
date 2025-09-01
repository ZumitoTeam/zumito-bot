import { Module, ServiceContainer } from "zumito-framework";
import { InventoryService } from "./services/InventoryService";

export class InventoryModule extends Module {
    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(InventoryService, [], true);
    }
}

