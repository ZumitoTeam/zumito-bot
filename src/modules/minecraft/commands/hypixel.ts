import { EmbedBuilder } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType, ServiceContainer } from "zumito-framework";
import { config } from "../../../config/index.js";
import { HypixelService } from "../services/HypixelService.js";

export class HypixelCommand extends Command {
    name = "hypixel";
    description = "Shows basic Hypixel stats of a player";
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
        const player = await this.hypixel.getPlayerStats(username);
        if (!player) {
            (message || interaction)?.reply({ content: trans('notfound'), allowedMentions: { repliedUser: false } });
            return;
        }
        const networkExp = player.networkExp || 0;
        const level = Math.floor((Math.sqrt(2 * networkExp + 30625) / 50) - 2.5);
        const rank = player.rank || player.newPackageRank || 'None';
        const bedwars = player.achievements?.bedwars_level || 0;
        const embed = new EmbedBuilder()
            .setTitle(trans('title', { user: username }))
            .addFields(
                { name: trans('level'), value: `${level}` },
                { name: trans('rank'), value: rank },
                { name: trans('bedwars'), value: `${bedwars}` }
            )
            .setColor(config.colors.default);
        (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
