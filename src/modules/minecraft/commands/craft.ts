import { EmbedBuilder } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, ServiceContainer } from "zumito-framework";
import { config } from "../../../config/index.js";
import { CraftingService } from "../services/CraftingService.js";

export class CraftCommand extends Command {
    name = "mccraft";
    description = "Shows the crafting recipe of an item";
    categories = ["minecraft"];
    args: CommandArgDefinition[] = [{
        name: "item",
        type: "string",
        optional: false,
    }];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"];

    crafting: CraftingService;

    constructor() {
        super();
        this.crafting = ServiceContainer.getService(CraftingService);
    }

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const item = args.get("item");
        if (!item) {
            (message || interaction)?.reply({ content: trans('error'), allowedMentions: { repliedUser: false } });
            return;
        }
        const data = await this.crafting.getRecipe(item);
        if (!data) {
            (message || interaction)?.reply({ content: trans('notfound'), allowedMentions: { repliedUser: false } });
            return;
        }
        const content = this.crafting.formatRecipe(data.recipe);
        const embed = new EmbedBuilder()
            .setTitle(trans('title', { item: data.item.displayName }))
            .setDescription(content)
            .setColor(config.colors.default);

        (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
