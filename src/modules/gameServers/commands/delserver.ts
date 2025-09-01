import { Command, CommandArgDefinition, CommandParameters, ServiceContainer } from "zumito-framework";
import { GameServerService } from "../services/GameServerService.js";

export class DelServerCommand extends Command {
    name = "delserver";
    description = "Deletes a game server you added";
    categories = ["minecraft"];
    args: CommandArgDefinition[] = [
        { name: "game", type: "string", optional: false },
        { name: "ip", type: "string", optional: false }
    ];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES"];

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const game = String(args.get("game")).toLowerCase();
        const ip = String(args.get("ip"));
        const ownerId = message?.author.id || interaction?.user.id || "";
        const service = ServiceContainer.getService(GameServerService) as GameServerService;
        const deleted = await service.removeServer(game, ip, ownerId);
        const content = deleted ? trans("success") : trans("notFound");
        (message || interaction)?.reply({ content, allowedMentions: { repliedUser: false } });
    }
}
