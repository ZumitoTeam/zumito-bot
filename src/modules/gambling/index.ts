import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { GamblingService } from "./services/GamblingService";
import { CoinflipCommand } from "./commands/coinflip";
import { SlotsCommand } from "./commands/slots";

export class GamblingModule extends Module {
    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(GamblingService, [], true);
    }
}
