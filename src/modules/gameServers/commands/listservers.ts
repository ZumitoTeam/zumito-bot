import { Command, CommandArgDefinition, CommandParameters, ServiceContainer } from "zumito-framework";
import { ServerListEmbedService } from "../services/embedBuilder/ServerListEmbedService.js";

export class ListServersCommand extends Command {
    name = "gameservers";
    description = "Shows the Minecraft server list";
    categories = ["minecraft"];
    args: CommandArgDefinition[] = [
        { name: "game", type: "string", optional: true }
    ];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"];

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const game = String(args.get("game") || "minecraft").toLowerCase();
        const embedService = ServiceContainer.getService(ServerListEmbedService) as ServerListEmbedService;
        const embed = await embedService.build(game, trans);
        (message || interaction)?.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
