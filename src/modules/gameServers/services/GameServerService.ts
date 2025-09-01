import { ServiceContainer, ZumitoFramework } from "zumito-framework";

export interface GameServer {
    game: string;
    name: string;
    ip: string;
}

export class GameServerService {
    private framework: ZumitoFramework;
    private db: any;

    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
        this.db = this.framework.database;
    }

    async addServer(server: GameServer): Promise<void> {
        await this.db.collection("gameServers").insertOne(server);
    }

    async getServers(game: string): Promise<GameServer[]> {
        return await this.db.collection("gameServers").find({ game }).toArray();
    }

    async getStatus(server: GameServer): Promise<{ online: boolean; players?: { online: number; max: number }; version?: string }>
 {
        if (server.game === "minecraft") {
            const res = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(server.ip)}`);
            const data = await res.json().catch(() => null);
            if (data && data.online) {
                return { online: true, players: data.players, version: data.version };
            }
            return { online: false };
        }
        return { online: false };
    }
}
