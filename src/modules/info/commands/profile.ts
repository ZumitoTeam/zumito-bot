import { Command, CommandParameters } from "zumito-framework";
import { EmbedBuilder } from "zumito-framework/discord";

export class ProfileCommand extends Command {
    name = "profile";
    description = "Show a user's Discord profile info in an embed.";
    args = [
        { name: "user", type: "user", optional: true }
    ];
    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const user = args.get("user") || message?.mentions?.users?.first() || message?.author || interaction?.user;
        if (!user) {
            const reply = "User not found.";
            if (message) {
                await message.reply(reply);
            } else if (interaction) {
                await interaction.reply(reply);
            }
            return;
        }
        const embed = new EmbedBuilder()
            .setTitle(`Profile of ${user.globalName || user.username}`)
            .setThumbnail(user.displayAvatarURL({ forceStatic: false, size: 4096 }))
            .addFields(
                { name: "Username", value: user.username, inline: true },
                { name: "ID", value: user.id, inline: true },
                { name: "Created", value: `<t:${Math.floor(user.createdTimestamp/1000)}:F>`, inline: false },
                ...(user.globalName ? [{ name: "Global Name", value: user.globalName, inline: true }] : [])
            )
            .setColor("#5865F2");
        if (message) {
            await message.reply({ embeds: [embed] });
        } else if (interaction) {
            await interaction.reply({ embeds: [embed] });
        }
    }
}
