import { Command, CommandParameters, CommandType, ServiceContainer } from "zumito-framework";
import { InventoryService, InventoryItem } from "../services/InventoryService";

export class InventoryCommand extends Command {
    name = "inventory";
    description = "View your inventory.";
    categories = ["inventory"];
    examples = ["@user"];
    usage = "inventory [user]";
    type = CommandType.any;
    args = [
        { name: "user", type: "user", optional: true }
    ];

    async execute({ message, interaction, args, framework, guildSettings }: CommandParameters): Promise<void> {
        const user = args.get("user") || message?.author || interaction?.user;
        if (!user) return;
        const guildId = message?.guild?.id || interaction?.guild?.id;
        const inventoryService = ServiceContainer.getService(InventoryService) as InventoryService;

        const globalItems = await inventoryService.getGlobalInventory(user.id);
        const guildItems = guildId ? await inventoryService.getGuildInventory(user.id, guildId) : [];

        const lines: string[] = [];
        lines.push(framework.translations.get("command.inventory.title", guildSettings.lang, { user: `<@${user.id}>` }));
        lines.push(framework.translations.get("command.inventory.globalTitle", guildSettings.lang));
        if (globalItems.length === 0) {
            lines.push(framework.translations.get("command.inventory.empty", guildSettings.lang));
        } else {
            lines.push(this.formatItems(globalItems, framework, guildSettings.lang));
        }
        if (guildId) {
            lines.push(framework.translations.get("command.inventory.guildTitle", guildSettings.lang));
            if (guildItems.length === 0) {
                lines.push(framework.translations.get("command.inventory.empty", guildSettings.lang));
            } else {
                lines.push(this.formatItems(guildItems, framework, guildSettings.lang));
            }
        }
        const content = lines.join("\n");
        if (message) {
            await message.reply(content);
        } else if (interaction) {
            await interaction.reply(content);
        }
    }

    private formatItems(items: InventoryItem[], framework: any, lang: string): string {
        return items
            .map(i => `• [${framework.translations.get(i.name, lang)}](${i.iconUrl})${i.tags?.length ? ` (${i.tags.join(', ')})` : ''}`)
            .join("\n");
    }
}

