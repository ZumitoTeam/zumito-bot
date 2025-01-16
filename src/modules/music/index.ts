import { Client } from "discord.js";
import DisTube, { Events } from "distube";
import { Module, ServiceContainer } from "zumito-framework";
import { YtDlpPlugin } from "@distube/yt-dlp";

export class MusicModule extends Module {

    private distube: DisTube;
    private discordClient: Client

    constructor(modulePath: string) {
        super(modulePath);
        this.discordClient = ServiceContainer.getService(Client);
        this.distube = new DisTube(this.discordClient, {
            plugins: [
                new YtDlpPlugin()
            ]
        });
        ServiceContainer.addService(DisTube, [], true, this.distube);
        this.initializeDistube();
    }

    initializeDistube() {
        this.distube.on(Events.ERROR, (error) => {
            console.log('Error while running DisTube');
            console.log(error);
        });
    }
}