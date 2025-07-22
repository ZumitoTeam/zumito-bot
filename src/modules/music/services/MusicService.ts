import { Client } from "zumito-framework/discord";
import { DisTube, Events as DisTubeEvents } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { ServiceContainer } from "zumito-framework";
import { VKMusicPlugin } from 'distube-vk-music-plugin'
import { BandlabPlugin } from "@distube/bandlab";

export class MusicService {
    public distube: DisTube;

    constructor(
        private client: Client = ServiceContainer.getService(Client),
    ) {
        client.options.intents = client.options.intents.bitfield;
        this.distube = new DisTube(client, {
            plugins: [
                new BandlabPlugin(),
                new SpotifyPlugin(),
                new SoundCloudPlugin(),
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
            .on(DisTubeEvents.ERROR, (error, queue) => {
                console.error("❌ Error DisTube:");
                if (queue) {
                    console.error("Queue ID:", queue.id, "TextChannel:", queue.textChannel?.id);
                }
                if (error instanceof Error) {
                    console.error("Mensaje:", error.message);
                    console.error("Stack:", error.stack);
                }
                console.error("Objeto de error completo:", error);
                try {
                    console.error("Error JSON:", JSON.stringify(error, null, 2));
                } catch {}
            });
    }
}
