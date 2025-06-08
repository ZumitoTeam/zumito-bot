import { Command, CommandParameters } from "zumito-framework";
import { PermissionsBitField } from "zumito-framework/discord";

export class BanCommand extends Command {
    name = "ban";
    description = "Ban a user from the server.";
    categories = ["moderation"];
    examples = ["@usuario", "1234567890 Spamming"];
    usage = "ban <user> [reason]";
    userPermissions: bigint[] = [PermissionsBitField.Flags.Administrator];
    args = [
        { name: "user", type: "user", optional: false },
        { name: "reason", type: "string", optional: true }
    ];
    async execute({ message, interaction, args }: CommandParameters) {
        const user = args.get("user");
        const reason = args.get("reason") || "No reason provided.";
        const guild = message?.guild || interaction?.guild;
        if (!guild) return;
        try {
            await guild.members.ban(user.id, { reason });
            if (message) {
                await message.reply(`User <@${user.id}> has been banned. Reason: ${reason}`);
            } else if (interaction) {
                await interaction.reply(`User <@${user.id}> has been banned. Reason: ${reason}`);
            }
        } catch (e) {
            if (message) {
                await message.reply(`Failed to ban user: ${e}`);
            } else if (interaction) {
                await interaction.reply(`Failed to ban user: ${e}`);
            }
        }
    }
}
