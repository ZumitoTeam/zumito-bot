import { ServiceContainer, ZumitoFramework } from "zumito-framework";

export interface GameServer {
    game: string;
    name: string;
    ip: string;
    ownerId?: string;
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

    async getServerById(id: string): Promise<(GameServer & { _id: any }) | null> {
        try {
            const { ObjectId } = await import('mongodb');
            const _id = new ObjectId(id);
            return await this.db.collection("gameServers").findOne({ _id });
        } catch {
            return null;
        }
    }

    async editServer(game: string, ip: string, ownerId: string, updates: Partial<Pick<GameServer, 'name' | 'ip'>>): Promise<boolean> {
        const $set: any = {};
        if (typeof updates.name === 'string' && updates.name.trim() !== '') {
            $set.name = updates.name.trim();
        }
        if (typeof updates.ip === 'string' && updates.ip.trim() !== '') {
            $set.ip = updates.ip.trim();
        }
        if (Object.keys($set).length === 0) return false;

        const res = await this.db.collection("gameServers").updateOne({ game, ip, ownerId }, { $set });
        return res.matchedCount > 0 && res.modifiedCount > 0;
    }

    async deleteServer(game: string, ip: string, ownerId: string): Promise<boolean> {
        const res = await this.db.collection("gameServers").deleteOne({ game, ip, ownerId });
        return res.deletedCount > 0;
    }

    async getGames(): Promise<{ game: string; count: number }[]> {
        const agg = [
            { $group: { _id: "$game", count: { $sum: 1 } } },
            { $project: { _id: 0, game: "$_id", count: 1 } },
            { $sort: { game: 1 } }
        ];
        return await this.db.collection("gameServers").aggregate(agg).toArray();
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

    async getDetailedStatus(server: GameServer): Promise<any> {
        if (server.game === "minecraft") {
            const res = await fetch(`https://api.mcsrvstat.us/2/${encodeURIComponent(server.ip)}`);
            const data = await res.json().catch(() => null);
            return data || { online: false };
        }
        return { online: false };
    }
}
