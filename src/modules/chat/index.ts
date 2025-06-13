import { Module, ServiceContainer, ZumitoFramework } from "zumito-framework";
import { MentionChatService } from "./services/MentionChatService";

export class ChatModule extends Module {
    constructor(modulePath: string, framework: ZumitoFramework) {
        super(modulePath);
        ServiceContainer.addService(MentionChatService, [], true);
    }
}
