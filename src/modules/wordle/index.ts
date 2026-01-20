import { Module, ServiceContainer } from "zumito-framework";
import { WordleService } from "./services/WordleService.js";
import { WordleButtonsService } from "./services/buttonBuilder/WordleButtonsService.js";
import { WordleCanvasService } from "./services/canvasBuilder/WordleCanvasService.js";

export class WordleModule extends Module {
    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(WordleService, [], true);
        ServiceContainer.addService(WordleButtonsService, [], true);
        ServiceContainer.addService(WordleCanvasService, [], true);
    }
}
