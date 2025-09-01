import { Command, CommandArgDefinition, CommandParameters, ServiceContainer } from "zumito-framework";
import { GameServerService } from "../services/GameServerService.js";

export class AddServerCommand extends Command {
    name = "addserver";
    description = "Adds a Minecraft server to the listing";
    categories = ["minecraft"];
    args: CommandArgDefinition[] = [
        { name: "game", type: "string", optional: false },
        { name: "ip", type: "string", optional: false },
        { name: "name", type: "string", optional: true }
    ];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES"];

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const game = String(args.get("game")).toLowerCase();
        const ip = args.get("ip");
        const name = args.get("name") || ip;
        const ownerId = message?.author.id || interaction?.user.id || "";
        if (game !== "minecraft") {
            (message || interaction)?.reply({ content: trans("invalidGame"), allowedMentions: { repliedUser: false } });
            return;
        }
        const service = ServiceContainer.getService(GameServerService) as GameServerService;
        await service.addServer({ game, ip, name, ownerId });
        (message || interaction)?.reply({ content: trans("success"), allowedMentions: { repliedUser: false } });
    }
}
