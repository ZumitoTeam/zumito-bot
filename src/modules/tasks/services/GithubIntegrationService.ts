import { ServiceContainer, ZumitoFramework } from "zumito-framework";

export interface OrgProject {
    org: string;
    id?: string;
    name: string;
    repo?: string; // optional default repository name
}

export class GithubIntegrationService {
    private framework: ZumitoFramework;
    private token: string | undefined;

    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
        this.token = process.env.GITHUB_TOKEN;
    }

    async listOrgProjects(org: string): Promise<OrgProject[]> {
        const col = this.framework.database.collection('github_projects');
        const rows = await col.find({ org }).toArray().catch(() => []);
        if (rows.length > 0) return rows as unknown as OrgProject[];
        // fallback to env JSON
        try {
            if (process.env.GITHUB_PROJECTS_JSON) {
                const parsed = JSON.parse(process.env.GITHUB_PROJECTS_JSON);
                if (Array.isArray(parsed)) return parsed.filter((p: any) => p.org === org);
            }
        } catch {}
        // fetch from GitHub (repositories as selectable projects)
        try {
            const headers: any = { 'Accept': 'application/vnd.github+json' };
            if (this.token) headers.Authorization = `Bearer ${this.token}`;
            const res = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100`, { headers } as any);
            if (res.ok) {
                const repos: any[] = await res.json();
                const projects: OrgProject[] = repos.map(r => ({ org, id: String(r.id), name: r.name, repo: `${org}/${r.name}` }));
                if (projects.length > 0) {
                    const ops = projects.map(p => ({ updateOne: { filter: { org, name: p.name }, update: { $set: p }, upsert: true } }));
                    await col.bulkWrite(ops).catch(() => undefined);
                }
                return projects;
            }
        } catch {}
        return [];
    }

    parseGithubUrl(url: string): { kind: 'issue' | 'pull' | 'unknown'; repo?: string; number?: number } {
        try {
            const u = new URL(url);
            if (u.hostname !== 'github.com') return { kind: 'unknown' };
            const parts = u.pathname.split('/').filter(Boolean);
            if (parts.length >= 4 && (parts[2] === 'issues' || parts[2] === 'pull')) {
                return { kind: parts[2] === 'issues' ? 'issue' : 'pull', repo: parts[0] + '/' + parts[1], number: Number(parts[3]) };
            }
            return { kind: 'unknown' };
        } catch {
            return { kind: 'unknown' };
        }
    }
}
