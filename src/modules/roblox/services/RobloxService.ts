export class RobloxService {
    async getUserId(username: string): Promise<number | null> {
        const res = await fetch('https://users.roblox.com/v1/usernames/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
        });
        if (!res.ok) return null;
        const data = await res.json().catch(() => null);
        return data?.data?.[0]?.id ?? null;
    }

    async getUserInfo(username: string): Promise<any | null> {
        const id = await this.getUserId(username);
        if (!id) return null;
        const res = await fetch(`https://users.roblox.com/v1/users/${id}`);
        if (!res.ok) return null;
        const data = await res.json().catch(() => null);
        return data;
    }

    async getAvatarUrl(id: number): Promise<string> {
        const res = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=352x352&format=Png&isCircular=false`);
        if (!res.ok) return '';
        const data = await res.json().catch(() => null);
        return data?.data?.[0]?.imageUrl || '';
    }
}
