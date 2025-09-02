import { Command, CommandArgDefinition, CommandParameters, ServiceContainer } from "zumito-framework";
import { GameServerService } from "../services/GameServerService.js";

export class DeleteServerCommand extends Command {
    name = "delserver";
    description = "Deletes a game server you added";
    categories = ["minecraft"]; // currently supports minecraft
    args: CommandArgDefinition[] = [
        { name: "game", type: "string", optional: false },
        { name: "ip", type: "string", optional: false }
    ];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES"];

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const game = String(args.get("game")).toLowerCase();
        const ip = String(args.get("ip"));

        if (game !== "minecraft") {
            (message || interaction)?.reply({ content: trans("invalidGame"), allowedMentions: { repliedUser: false } });
            return;
        }

        const ownerId = message?.author?.id || interaction?.user?.id || "";
        const service = ServiceContainer.getService(GameServerService) as GameServerService;
        const ok = await service.deleteServer(game, ip, ownerId);
        (message || interaction)?.reply({ content: ok ? trans("deleted") : trans("notOwner"), allowedMentions: { repliedUser: false } });
    }
}

