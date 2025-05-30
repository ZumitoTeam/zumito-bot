import { PermissionsBitField } from "discord.js";
import { Command, CommandParameters } from "zumito-framework";

export class WarnCommand extends Command {
    name = "warn";
    description = "Warn a user in the server.";
    args = [
        { name: "user", type: "user", optional: false },
        { name: "reason", type: "string", optional: true }
    ];
    userPermissions: bigint[] = [PermissionsBitField.Flags.Administrator]

    async execute({ message, interaction, args }: CommandParameters) {
        const user = args.get("user");
        const reason = args.get("reason") || "No reason provided.";
        if (message) {
            await message.reply(`User <@${user.id}> has been warned. Reason: ${reason}`);
        } else if (interaction) {
            await interaction.reply(`User <@${user.id}> has been warned. Reason: ${reason}`);
        }
        // You can extend this to log warnings in a database or moderation log.
    }
}
