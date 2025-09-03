import { ServiceContainer, ZumitoFramework } from "zumito-framework";
import { randomUUID } from "crypto";

export type TaskStatus = 'backlog' | 'working' | 'testing' | 'beta' | 'done';

export interface TaskComment {
    id: string;
    user: { id: string; name: string };
    text: string;
    at: number;
}

export interface TaskTester {
    id: string;
    name: string;
    approved: boolean;
}

export interface GithubLink {
    type: 'issue' | 'pr';
    repo: string; // e.g., owner/repo
    number: number;
    url: string;
}

export interface TaskItem {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    assignees: { id: string; name: string }[];
    testers: TaskTester[];
    comments: TaskComment[];
    approvals: number;
    github?: GithubLink;
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
            assignees: data.assignees || [],
            testers: data.testers || [],
            comments: [],
            approvals: 0,
            github: data.github,
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
        if (idx >= 0) {
            testers[idx].approved = approved;
        } else {
            testers.push({ id: testerId, name: testerName || testerId, approved });
        }
        const approvals = testers.filter(t => t.approved).length;
        await this.col().updateOne({ id }, { $set: { testers, approvals, updatedAt: Date.now() } });
        const updated = await this.col().findOne({ id });
        return updated as TaskItem | null;
    }
}

