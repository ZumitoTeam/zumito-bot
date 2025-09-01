import { ServiceContainer, ZumitoFramework } from "zumito-framework";

export interface InventoryItem {
    iconUrl: string;
    name: string;
    data: any[];
    tags: string[];
}

export class InventoryService {
    private framework: ZumitoFramework;

    constructor() {
        this.framework = ServiceContainer.getService(ZumitoFramework);
    }

    async addItem(userId: string, item: InventoryItem, guildId?: string): Promise<void> {
        await this.framework.database.collection("inventories").updateOne(
            { userId, guildId: guildId || null },
            { $push: { items: item } },
            { upsert: true }
        );
    }

    async getGlobalInventory(userId: string): Promise<InventoryItem[]> {
        const doc = await this.framework.database.collection("inventories").findOne({ userId, guildId: null });
        return doc?.items || [];
    }

    async getGuildInventory(userId: string, guildId: string): Promise<InventoryItem[]> {
        const doc = await this.framework.database.collection("inventories").findOne({ userId, guildId });
        return doc?.items || [];
    }
}

