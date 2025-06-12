export class HypixelService {
    async getUUID(username: string): Promise<string | null> {
        const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`);
        if (!res.ok) return null;
        const data = await res.json().catch(() => null);
        return data?.id || null;
    }

    async getPlayerStats(username: string): Promise<any | null> {
        const uuid = await this.getUUID(username);
        if (!uuid) return null;
        const apiKey = process.env.HYPIXEL_API_KEY;
        if (!apiKey) return null;
        const res = await fetch(`https://api.hypixel.net/player?key=${apiKey}&uuid=${uuid}`);
        if (!res.ok) return null;
        const data = await res.json().catch(() => null);
        return data?.player || null;
    }
}
