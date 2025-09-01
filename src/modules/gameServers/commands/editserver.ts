import { Command, CommandArgDefinition, CommandParameters, ServiceContainer } from "zumito-framework";
import { GameServerService } from "../services/GameServerService.js";

export class EditServerCommand extends Command {
    name = "editserver";
    description = "Edits a game server you added";
    categories = ["minecraft"];
    args: CommandArgDefinition[] = [
        { name: "game", type: "string", optional: false },
        { name: "ip", type: "string", optional: false },
        { name: "newip", type: "string", optional: true },
        { name: "name", type: "string", optional: true }
    ];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES"];

    async execute({ message, interaction, args, trans }: CommandParameters): Promise<void> {
        const game = String(args.get("game")).toLowerCase();
        const ip = String(args.get("ip"));
        const newIp = args.get("newip") as string | undefined;
        const name = args.get("name") as string | undefined;
        const ownerId = message?.author.id || interaction?.user.id || "";
        const service = ServiceContainer.getService(GameServerService) as GameServerService;
        const updated = await service.updateServer(game, ip, ownerId, { ip: newIp, name });
        const content = updated ? trans("success") : trans("notFound");
        (message || interaction)?.reply({ content, allowedMentions: { repliedUser: false } });
    }
}
