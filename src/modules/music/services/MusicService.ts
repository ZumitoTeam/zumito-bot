import { Client } from "discord.js";
import { DisTube, Events as DisTubeEvents } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { YtDlpPlugin } from "@distube/yt-dlp";

export class MusicService {
    public distube: DisTube;

    constructor(client: Client) {
        this.distube = new DisTube(client, {
            plugins: [
                new SpotifyPlugin(),
                new SoundCloudPlugin(),
                new YtDlpPlugin(),
            ],
        });
        this.registerEvents();
    }

    registerEvents() {
        this.distube
            .on(DisTubeEvents.PLAY_SONG, (queue, song) => {
                queue.textChannel?.send(`🎶 Reproduciendo: **${song.name}**`);
            })
            .on(DisTubeEvents.ADD_SONG, (queue, song) => {
                queue.textChannel?.send(`➕ Añadido: **${song.name}**`);
            })
            .on(DisTubeEvents.ERROR, (channel, error) => {
                if (channel && typeof (channel as any).send === "function") {
                    (channel as any).send(`❌ Error: ${error.toString()}`);
                } else {
                    console.error("❌ Error:", error);
                }
            });
    }
}
