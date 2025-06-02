import { PermissionsBitField } from "discord.js";
import { Command, CommandParameters, ServiceContainer } from "zumito-framework";
import { ModerationService } from "../services/ModerationService";

export class WarnCommand extends Command {
    name = "warn";
    description = "Warn a user in the server.";
    categories = ["moderation"];
    examples = ["warn @usuario", "warn 1234567890 Conducta inapropiada"];
    usage = "warn <user> [reason]";
    args = [
        { name: "user", type: "user", optional: false },
        { name: "reason", type: "string", optional: true }
    ];
    userPermissions: bigint[] = [PermissionsBitField.Flags.Administrator]

    constructor(
        private moderationService = ServiceContainer.getService(ModerationService)
    ) {
        super();
    }

    async execute({ message, interaction, args }: CommandParameters) {
        const user = args.get("user");
        const reason = args.get("reason") || "No reason provided.";
        await this.moderationService.warn(
            message?.guild?.id || interaction?.guild?.id!,
            user.id,
            message?.author.id || interaction?.user.id!,
            reason
        );
        if (message) {
            await message.reply(`User <@${user.id}> has been warned. Reason: ${reason}`);
        } else if (interaction) {
            await interaction.reply(`User <@${user.id}> has been warned. Reason: ${reason}`);
        }
        // You can extend this to log warnings in a database or moderation log.
    }
}
