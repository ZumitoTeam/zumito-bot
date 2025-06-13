import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { ServerPageViewService } from "./services/ServerPageViewService";

export class ServerPagesModule extends Module {
    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);
        ServiceContainer.addService(ServerPageViewService, [], true);
    }
}
