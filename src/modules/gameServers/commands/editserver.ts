import { Command, CommandArgDefinition, CommandParameters, ServiceContainer } from "zumito-framework";
import { GameServerService } from "../services/GameServerService.js";

export class EditServerCommand extends Command {
    name = "editserver";
    description = "Edits a game server you added";
    categories = ["minecraft"]; // currently supports minecraft
    args: CommandArgDefinition[] = [
        { name: "game", type: "string", optional: false },
        { name: "ip", type: "string", optional: false },
        { name: "name", type: "string", optional: true },
        { name: "newip", type: "string", optional: true }
    ];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES"];

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const game = String(args.get("game")).toLowerCase();
        const ip = String(args.get("ip"));
        const name = args.get("name") as string | undefined;
        const newip = args.get("newip") as string | undefined;

        if (game !== "minecraft") {
            (message || interaction)?.reply({ content: trans("invalidGame"), allowedMentions: { repliedUser: false } });
            return;
        }
        if (!name && !newip) {
            (message || interaction)?.reply({ content: trans("nothingToUpdate"), allowedMentions: { repliedUser: false } });
            return;
        }

        const ownerId = message?.author?.id || interaction?.user?.id || "";
        const service = ServiceContainer.getService(GameServerService) as GameServerService;
        const ok = await service.editServer(game, ip, ownerId, { name, ip: newip });
        (message || interaction)?.reply({ content: ok ? trans("updated") : trans("notOwner"), allowedMentions: { repliedUser: false } });
    }
}

