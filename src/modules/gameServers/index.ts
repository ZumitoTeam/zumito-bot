import { Module, ServiceContainer } from "zumito-framework";
import { GameServerService } from "./services/GameServerService.js";
import { ServerListEmbedService } from "./services/embedBuilder/ServerListEmbedService.js";
import { ServerListViewService } from "./services/ServerListViewService.js";

export class GameServersModule extends Module {
    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(GameServerService, [], true);
        ServiceContainer.addService(ServerListEmbedService, [], true);
        ServiceContainer.addService(ServerListViewService, [], true);
    }
}
