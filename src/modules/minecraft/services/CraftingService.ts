export interface ItemData {
    id: number;
    name: string;
    displayName: string;
}

export interface RecipeData {
    inShape?: (number | null)[][];
    ingredients?: number[];
    result: { id: number; count: number };
}

export class CraftingService {
    private itemsByName: Map<string, ItemData> = new Map();
    private itemsById: Map<number, ItemData> = new Map();
    private recipes: Record<string, RecipeData[]> = {};
    private loaded = false;

    private async loadData(): Promise<void> {
        if (this.loaded) return;
        const itemsUrl = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.20/items.json';
        const recipesUrl = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.20/recipes.json';
        const [itemsRes, recipesRes] = await Promise.all([
            fetch(itemsUrl),
            fetch(recipesUrl),
        ]);
        const items = await itemsRes.json() as ItemData[];
        const recipes = await recipesRes.json() as Record<string, RecipeData[]>;
        for (const item of items) {
            this.itemsByName.set(item.name.toLowerCase(), item);
            this.itemsByName.set(item.displayName.toLowerCase(), item);
            this.itemsById.set(item.id, item);
        }
        this.recipes = recipes;
        this.loaded = true;
    }

    private getItemById(id: number): ItemData | null {
        return this.itemsById.get(id) || null;
    }

    async getRecipe(itemName: string): Promise<{ item: ItemData; recipe: RecipeData } | null> {
        await this.loadData();
        const key = itemName.toLowerCase().replace(/ /g, '_');
        const item = this.itemsByName.get(key);
        if (!item) return null;
        const rec = this.recipes[item.id];
        if (!rec || rec.length === 0) return null;
        return { item, recipe: rec[0] };
    }

    formatRecipe(recipe: RecipeData): string {
        if (recipe.inShape) {
            const rows = recipe.inShape.map(row => row.map(id => {
                if (id === null || id === undefined) return ' ';
                const itm = this.getItemById(id);
                return itm ? itm.displayName : ' ';
            }).join(' | '));
            return rows.join('\n');
        } else if (recipe.ingredients) {
            const names = recipe.ingredients.map(id => {
                const itm = this.getItemById(id);
                return `- ${itm ? itm.displayName : ''}`;
            });
            return names.join('\n');
        }
        return '';
    }
}
