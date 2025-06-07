import { Client } from "discord.js";
import { Module, ServiceContainer } from "zumito-framework";
import { MusicService } from "./services/MusicService";

export class MusicModule extends Module {

    constructor(modulePath: string) {
        super(modulePath);
        ServiceContainer.addService(MusicService, [], true)
    }
}