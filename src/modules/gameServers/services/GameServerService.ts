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
        if (server.game !== "minecraft") return { online: false };

        const mcsrvUrl = `https://api.mcsrvstat.us/2/${encodeURIComponent(server.ip)}`;
        const mcstatusUrl = `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(server.ip)}`;

        const fetchJson = async (url: string) => {
            try {
                const r = await fetch(url);
                return await r.json();
            } catch {
                return null;
            }
        };

        const [a, b] = await Promise.all([fetchJson(mcsrvUrl), fetchJson(mcstatusUrl)]);

        // Normalize pieces
        const online = Boolean(a?.online || b?.online);
        const players = a?.players || b?.players || undefined;
        const version = a?.version || b?.version?.name_clean || b?.version?.name || undefined;
        const hostname = a?.hostname || b?.host || undefined;
        const ip = a?.ip || b?.ip_address || server.ip;
        const port = a?.port || b?.port || undefined;
        const protocol = b?.version?.protocol || a?.protocol || undefined;
        const favicon = a?.icon || b?.favicon || undefined; // data:image/png;base64,...
        const motd = a?.motd || b?.motd || undefined;
        const plugins = a?.plugins || b?.mod_info?.modList || undefined;
        const mods = a?.mods || b?.mods || undefined;
        const srv = a?.srv || undefined;
        const latency = b?.latency || undefined;
        const playersList = b?.players?.list || a?.players?.list || undefined;

        return {
            online,
            ip,
            port,
            hostname,
            version,
            protocol,
            players,
            playersList,
            favicon,
            motd,
            plugins,
            mods,
            srv,
            latency,
            sources: { mcsrvstat: a, mcstatus: b }
        };
    }
}
