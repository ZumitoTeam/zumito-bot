import { Module, ServiceContainer } from "zumito-framework";
import { BlurService } from "./services/imageProcessor/BlurService.js";

export class ImagesModule extends Module {
    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(BlurService, [], true);
    }
}

