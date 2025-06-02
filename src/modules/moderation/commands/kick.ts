import { Command, CommandParameters } from "zumito-framework";
import { PermissionsBitField } from "zumito-framework/discord";

export class KickCommand extends Command {
    name = "kick";
    description = "Kick a user from the server.";
    categories = ["moderation"];
    examples = ["kick @usuario", "kick 1234567890 Flood"];
    usage = "kick <user> [reason]";
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
            const member = guild.members.cache.get(user.id);
            if (!member) throw new Error("User not found in this server.");
            await member.kick(reason);
            if (message) {
                await message.reply(`User <@${user.id}> has been kicked. Reason: ${reason}`);
            } else if (interaction) {
                await interaction.reply(`User <@${user.id}> has been kicked. Reason: ${reason}`);
            }
        } catch (e) {
            if (message) {
                await message.reply(`Failed to kick user: ${e}`);
            } else if (interaction) {
                await interaction.reply(`Failed to kick user: ${e}`);
            }
        }
    }
}
