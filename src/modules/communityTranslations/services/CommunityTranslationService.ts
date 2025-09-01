import { ServiceContainer, ZumitoFramework } from "zumito-framework";
import { promises as fs } from "fs";
import path from "path";
import recursive from "fs-readdir-recursive";
import { ObjectId } from "mongodb";
import os from "os";
import { spawnSync } from "child_process";

interface MissingTranslation {
    key: string;
    defaultValue: string;
    filePath: string;
}

interface TranslationProposal {
    lang: string;
    filePath: string;
    key: string;
    value: string;
}

interface CommunityTranslation {
    id: string;
    lang: string;
    filePath: string;
    key: string;
    value: string;
    votes: number;
}

export class CommunityTranslationService {
    constructor(
        private framework: ZumitoFramework = ServiceContainer.getService(ZumitoFramework),
    ) {}

    async getMissingTranslations(lang: string): Promise<MissingTranslation[]> {
        const modulesPath = path.resolve(process.cwd(), "src/modules");
        const files = recursive(modulesPath);
        const missing: MissingTranslation[] = [];

        for (const file of files) {
            if (!file.endsWith("/en.json")) continue;
            const enPath = path.join(modulesPath, file);
            const targetPath = enPath.replace(/en\.json$/, `${lang}.json`);
            const enData = JSON.parse(await fs.readFile(enPath, "utf8"));
            let langData: any = {};
            try {
                const content = await fs.readFile(targetPath, "utf8");
                langData = JSON.parse(content);
            } catch {
                langData = {};
            }
            const enFlat = this.flatten(enData);
            const langFlat = this.flatten(langData);
            for (const key of Object.keys(enFlat)) {
                if (!(key in langFlat)) {
                    missing.push({
                        key,
                        defaultValue: enFlat[key],
                        filePath: path.relative(process.cwd(), targetPath),
                    });
                }
            }
        }

        return missing;
    }

    private flatten(obj: any, prefix = ""): Record<string, string> {
        const result: Record<string, string> = {};
        for (const [key, value] of Object.entries(obj)) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (value && typeof value === "object") {
                Object.assign(result, this.flatten(value as any, newKey));
            } else {
                result[newKey] = String(value);
            }
        }
        return result;
    }

    async submitTranslation(data: TranslationProposal): Promise<void> {
        await this.framework.database.collection("community_translations").insertOne({
            ...data,
            votes: 0,
            createdAt: new Date(),
        });
    }

    async getCommunityTranslations(lang: string): Promise<CommunityTranslation[]> {
        const results = await this.framework.database.collection("community_translations").find({ lang }).toArray();
        return results.map(r => ({
            id: r._id.toString(),
            lang: r.lang,
            filePath: r.filePath,
            key: r.key,
            value: r.value,
            votes: r.votes || 0,
        }));
    }

    async voteTranslation(id: string, delta: number): Promise<void> {
        await this.framework.database.collection("community_translations").updateOne({
            _id: new ObjectId(id),
        }, { $inc: { votes: delta } });
    }

    async generatePatch(): Promise<string> {
        const approved = await this.framework.database.collection("community_translations").find({ votes: { $gte: 3 } }).toArray();
        if (approved.length === 0) return "";
        const grouped: Record<string, any[]> = {};
        for (const item of approved) {
            if (!grouped[item.filePath]) grouped[item.filePath] = [];
            grouped[item.filePath].push(item);
        }
        let patch = "";
        for (const [filePath, items] of Object.entries(grouped)) {
            const absPath = path.resolve(process.cwd(), filePath);
            let original = "{}\n";
            try {
                original = await fs.readFile(absPath, "utf8");
            } catch {}
            let json: any = {};
            try {
                json = JSON.parse(original);
            } catch {
                json = {};
            }
            for (const item of items) {
                const parts = item.key.split(".");
                let obj = json;
                for (let i = 0; i < parts.length - 1; i++) {
                    const part = parts[i];
                    obj[part] = obj[part] || {};
                    obj = obj[part];
                }
                obj[parts[parts.length - 1]] = item.value;
            }
            const updated = JSON.stringify(json, null, 4) + "\n";
            const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ct-"));
            const oldFile = path.join(tmpDir, "old.json");
            const newFile = path.join(tmpDir, "new.json");
            await fs.writeFile(oldFile, original);
            await fs.writeFile(newFile, updated);
            const diff = spawnSync("diff", ["-u", oldFile, newFile], { encoding: "utf8" }).stdout;
            patch += `diff --git a/${filePath} b/${filePath}\n${diff}`;
            await fs.rm(tmpDir, { recursive: true, force: true });
        }
        return patch;
    }
}

export type { MissingTranslation, TranslationProposal, CommunityTranslation };
