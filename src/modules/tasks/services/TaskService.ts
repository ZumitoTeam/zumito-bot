import { ServiceContainer, ZumitoFramework } from "zumito-framework";
import { randomUUID } from "crypto";

export type TaskStatus = 'backlog' | 'working' | 'testing' | 'pendingFix' | 'pendingPublish' | 'beta' | 'done';

export interface TaskComment {
    id: string;
    user: { id: string; name: string; avatar?: string | null };
    text: string;
    at: number;
}

export interface TaskTester {
    id: string;
    name: string;
    avatar?: string | null;
    approved: boolean;
    lastApprovalAt?: number;
}

export interface GithubLink {
    type: 'issue' | 'pr';
    repo: string; // e.g., owner/repo
    number: number;
    url: string;
}

export interface GithubProjectRef {
    org: string;
    name: string;
    id?: string;
}

export interface GithubIssueLink {
    repo: string;
    number: number;
    url: string;
}

export interface GithubPullLink {
    repo: string;
    number: number;
    url: string;
    state?: 'open' | 'closed' | 'merged' | 'unknown';
}

export interface TaskItem {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    public?: boolean;
    assignees: { id: string; name: string }[];
    owner?: { id: string; name: string; avatar?: string | null } | null;
    testers: TaskTester[];
    comments: TaskComment[];
    approvals: number;
    github?: GithubLink; // legacy single link
    githubProject?: GithubProjectRef | null;
    repo?: string | null;
    branch?: string | null;
    issue?: GithubIssueLink | null;
    pulls?: GithubPullLink[];
    createdAt: number;
    updatedAt: number;
}

export class TaskService {
    private framework: ZumitoFramework;

    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
    }

    private col() {
        return this.framework.database.collection('tasks');
    }

    async list(): Promise<TaskItem[]> {
        const tasks = await this.col().find().toArray();
        return tasks as TaskItem[];
    }

    async create(data: Partial<TaskItem>): Promise<TaskItem> {
        const now = Date.now();
        const task: TaskItem = {
            id: data.id || randomUUID(),
            title: data.title || 'Untitled',
            description: data.description || '',
            status: (data.status || 'backlog') as TaskStatus,
            public: data.public || false,
            assignees: data.assignees || [],
            owner: data.owner || null,
            testers: data.testers || [],
            comments: [],
            approvals: 0,
            github: data.github,
            githubProject: data.githubProject || null,
            repo: data.repo || null,
            branch: data.branch || null,
            issue: data.issue || null,
            pulls: data.pulls || [],
            createdAt: now,
            updatedAt: now,
        };
        await this.col().insertOne(task);
        return task;
    }

    async update(id: string, patch: Partial<TaskItem>): Promise<TaskItem | null> {
        const update: any = { ...patch, updatedAt: Date.now() };
        if (patch.testers) {
            update.approvals = patch.testers.filter(t => t.approved).length;
        }
        if (typeof patch.public !== 'undefined') {
            update.public = patch.public;
        }
        await this.col().updateOne({ id }, { $set: update });
        const updated = await this.col().findOne({ id });
        return updated as TaskItem | null;
    }

    async addComment(id: string, comment: Omit<TaskComment, 'id' | 'at'>): Promise<TaskItem | null> {
        const entry: TaskComment = { id: randomUUID(), at: Date.now(), ...comment };
        await this.col().updateOne({ id }, { $push: { comments: entry }, $set: { updatedAt: Date.now() } });
        const updated = await this.col().findOne({ id });
        return updated as TaskItem | null;
    }

    async setTesterApproval(id: string, testerId: string, approved: boolean, testerName?: string): Promise<TaskItem | null> {
        const task = await this.col().findOne({ id }) as TaskItem | null;
        if (!task) return null;
        const testers = task.testers || [];
        const idx = testers.findIndex(t => t.id === testerId);
        const now = Date.now();
        if (idx >= 0) {
            testers[idx].approved = approved;
            testers[idx].lastApprovalAt = now; // mark action time regardless of decision
        } else {
            testers.push({ id: testerId, name: testerName || testerId, approved, lastApprovalAt: now });
        }
        const approvals = testers.filter(t => t.approved).length;
        await this.col().updateOne({ id }, { $set: { testers, approvals, updatedAt: Date.now() } });
        const updated = await this.col().findOne({ id });
        return updated as TaskItem | null;
    }

    async addPull(id: string, pull: GithubPullLink): Promise<TaskItem | null> {
        await this.col().updateOne({ id }, { $push: { pulls: pull }, $set: { updatedAt: Date.now() } });
        const updated = await this.col().findOne({ id });
        return updated as TaskItem | null;
    }

    async removePull(id: string, repo: string, number: number): Promise<TaskItem | null> {
        await this.col().updateOne({ id }, { $pull: { pulls: { repo, number } as any }, $set: { updatedAt: Date.now() } });
        const updated = await this.col().findOne({ id });
        return updated as TaskItem | null;
    }

    async setOwner(id: string, owner: { id: string; name: string } | null): Promise<TaskItem | null> {
        await this.col().updateOne({ id }, { $set: { owner, updatedAt: Date.now() } });
        const updated = await this.col().findOne({ id });
        return updated as TaskItem | null;
    }
}
