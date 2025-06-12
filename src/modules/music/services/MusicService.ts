import { Client } from "discord.js";
import { DisTube, Events as DisTubeEvents } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { YtDlpPlugin } from "@distube/yt-dlp";
import { YouTubePlugin } from "@distube/youtube";
import { ServiceContainer } from "zumito-framework";

export class MusicService {
    public distube: DisTube;

    constructor(
        private client: Client = ServiceContainer.getService(Client),
    ) {
        this.distube = new DisTube(client, {
            plugins: [
                new SpotifyPlugin(),
                new SoundCloudPlugin(),
                new YouTubePlugin({
                    cookies: [
{
    "domain": ".youtube.com",
    "expirationDate": 1781720847.192281,
    "hostOnly": false,
    "httpOnly": false,
    "name": "__Secure-1PAPISID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "olu3pBWw9kAdDeqA/AXww6Htzf4wKgvAnE",
    "id": 1
},
{
    "domain": ".youtube.com",
    "expirationDate": 1781720847.192435,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "g.a000wwjRisqd8YyngF7ftQ_3cezL6feearSIkNHSLt_e-RpMNfcxHtUhPfQR33Jgx0xUhFt2dQACgYKAR8SARASFQHGX2MiCe9vVPSQpqY3-5Ei_tqT3hoVAUF8yKoujQ9R500HLGxPAmZDZ0Bx0076",
    "id": 2
},
{
    "domain": ".youtube.com",
    "expirationDate": 1780845056.248559,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-1PSIDCC",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzUeeHnq6SfGm__eRAPIGIu7jLGTc8djyMrZ_mimUHQS6w-8xK4O14SbkS9UUjYYsVnxrVk",
    "id": 3
},
{
    "domain": ".youtube.com",
    "expirationDate": 1781720847.192297,
    "hostOnly": false,
    "httpOnly": false,
    "name": "__Secure-3PAPISID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "olu3pBWw9kAdDeqA/AXww6Htzf4wKgvAnE",
    "id": 4
},
{
    "domain": ".youtube.com",
    "expirationDate": 1781720847.19245,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSID",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "g.a000wwjRisqd8YyngF7ftQ_3cezL6feearSIkNHSLt_e-RpMNfcxUZAYgfIu_ULvyJYvJbNVBgACgYKAXMSARASFQHGX2MiNSkmhM4bNGCG28PeoL9qcBoVAUF8yKo4O4f35VRnIdzssukgL9i30076",
    "id": 5
},
{
    "domain": ".youtube.com",
    "expirationDate": 1780845056.248601,
    "hostOnly": false,
    "httpOnly": true,
    "name": "__Secure-3PSIDCC",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzUFkPU2s0IaazuoAbBInYnTCszABmLFOwX7sYAU5OLRuBdPB2_2eGdAqrk_ohrKmTppyLA",
    "id": 6
},
{
    "domain": ".youtube.com",
    "expirationDate": 1755944548,
    "hostOnly": false,
    "httpOnly": false,
    "name": "_gcl_au",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "1.1.1028760948.1748168548",
    "id": 7
},
{
    "domain": ".youtube.com",
    "expirationDate": 1781720847.192246,
    "hostOnly": false,
    "httpOnly": false,
    "name": "APISID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "cd6uddjorId-8n70/A9i1s5pWm3Q8Cm58r",
    "id": 8
},
{
    "domain": ".youtube.com",
    "expirationDate": 1781720847.192176,
    "hostOnly": false,
    "httpOnly": true,
    "name": "HSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "AI5-p9TpmytdalKsb",
    "id": 9
},
{
    "domain": ".youtube.com",
    "expirationDate": 1780607160.65708,
    "hostOnly": false,
    "httpOnly": true,
    "name": "LOGIN_INFO",
    "path": "/",
    "sameSite": "no_restriction",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "AFmmF2swRgIhALxR46TJw7bNSu0yKuvWKUlxsrdKizBE3V3HzDVkybghAiEAyJ2gRZhxJIfAAjYIzVGrkOQI8IOBbXe1aglrv6qUU0Q:QUQ3MjNmeXNHbGhNc1ZuZjBXVjhvNUxQYW1qemtNWHZOMHVhaXJ4cVpieTdXNlVPcUhnd09YX1pzY1QxUkFHNkswVkJFclhiWHJkVEkzbnV3dGpxTkFGMW9kcVRzd2JVSVRCaUhOVUVrclMybF9pOWJrdVdkc3VuSV8wdW9GQTRrenRWTW54amhoVjFLTmQ5cVB4YzZWaEMyR1R0MDF5VTlR",
    "id": 10
},
{
    "domain": ".youtube.com",
    "expirationDate": 1783869045.19831,
    "hostOnly": false,
    "httpOnly": false,
    "name": "PREF",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "tz=Europe.Madrid&autoplay=true&volume=90&library_tab_browse_id=FEmusic_library_landing&f7=100&repeat=NONE",
    "id": 11
},
{
    "domain": ".youtube.com",
    "expirationDate": 1781720847.192265,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SAPISID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "olu3pBWw9kAdDeqA/AXww6Htzf4wKgvAnE",
    "id": 12
},
{
    "domain": ".youtube.com",
    "expirationDate": 1781720847.192418,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "g.a000wwjRisqd8YyngF7ftQ_3cezL6feearSIkNHSLt_e-RpMNfcxecDwqnY32vsRMOTmS8knsAACgYKAWkSARASFQHGX2Mi9Hpuv0ees--xAbY1YAGoLhoVAUF8yKq8dgyuoPILhBSWW5ngC9Kc0076",
    "id": 13
},
{
    "domain": ".youtube.com",
    "expirationDate": 1780845056.248476,
    "hostOnly": false,
    "httpOnly": false,
    "name": "SIDCC",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "AKEyXzVgKSbIicwxiOChYkRJ5rx-VH3dFePU9QkaWqbHEK2lMqXnKbR71p5M2xPwx39XW6ehkaU",
    "id": 14
},
{
    "domain": ".youtube.com",
    "expirationDate": 1781720847.192228,
    "hostOnly": false,
    "httpOnly": true,
    "name": "SSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "ASOHxhNH90r1ZNqYp",
    "id": 15
},
{
    "domain": ".youtube.com",
    "expirationDate": 1749309061,
    "hostOnly": false,
    "httpOnly": false,
    "name": "ST-3opvp5",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "session_logininfo=AFmmF2swRgIhALxR46TJw7bNSu0yKuvWKUlxsrdKizBE3V3HzDVkybghAiEAyJ2gRZhxJIfAAjYIzVGrkOQI8IOBbXe1aglrv6qUU0Q%3AQUQ3MjNmeXNHbGhNc1ZuZjBXVjhvNUxQYW1qemtNWHZOMHVhaXJ4cVpieTdXNlVPcUhnd09YX1pzY1QxUkFHNkswVkJFclhiWHJkVEkzbnV3dGpxTkFGMW9kcVRzd2JVSVRCaUhOVUVrclMybF9pOWJrdVdkc3VuSV8wdW9GQTRrenRWTW54amhoVjFLTmQ5cVB4YzZWaEMyR1R0MDF5VTlR",
    "id": 16
}
]
                }),
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
