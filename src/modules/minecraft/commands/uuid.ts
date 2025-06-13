import { EmbedBuilder } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters } from "zumito-framework";
import { ServiceContainer } from "zumito-framework";
import { config } from "../../../config/index.js";
import { HypixelService } from "../services/HypixelService.js";

export class UUIDCommand extends Command {
    name = "mcuuid";
    description = "Shows the UUID of a Minecraft player";
    categories = ["minecraft"];
    args: CommandArgDefinition[] = [{
        name: "username",
        type: "string",
        optional: false,
    }];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"];

    hypixel: HypixelService;

    constructor() {
        super();
        this.hypixel = ServiceContainer.getService(HypixelService);
    }

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const username = args.get("username");
        if (!username) {
            (message || interaction)?.reply({ content: trans('error'), allowedMentions: { repliedUser: false } });
            return;
        }
        const uuid = await this.hypixel.getUUID(username);
        if (!uuid) {
            (message || interaction)?.reply({ content: trans('notfound'), allowedMentions: { repliedUser: false } });
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle(trans('title', { user: username }))
            .setDescription(trans('uuid', { uuid }))
            .setColor(config.colors.default);

        (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
