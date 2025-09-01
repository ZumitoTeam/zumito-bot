import { Command, CommandParameters, ServiceContainer } from "zumito-framework";
import { EmbedBuilder, MessageFlags, PermissionsBitField, Role } from "zumito-framework/discord";
import { AutoRoleService } from "../services/AutoRoleService";

export class AutoroleCommand extends Command {
    name = "autorole";
    description = "Create an auto role message";
    categories = ["configuration"];
    userPermissions: bigint[] = [PermissionsBitField.Flags.ManageRoles];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_ROLES"];
    args = [
        { name: "role", type: "role", optional: false },
        { name: "emoji", type: "string", optional: false },
        { name: "text", type: "string", optional: true }
    ];

    async execute({ message, interaction, args }: CommandParameters): Promise<void> {
        const guild = message?.guild || interaction?.guild;
        const channel: any = message?.channel || interaction?.channel;
        const role = args.get("role") as Role;
        const emoji = args.get("emoji") as string;
        const text = args.get("text") as string || `React with ${emoji} to get ${role}`;
        if (!guild || !channel || !role || !emoji) {
            const reply = "Missing role or emoji.";
            if (interaction) await interaction.reply({ content: reply, flags: MessageFlags.Ephemeral });
            else if (message) await message.reply(reply);
            return;
        }
        const embed = new EmbedBuilder().setDescription(text);
        const sendOptions = { embeds: [embed], fetchReply: true } as any;
        const sent = interaction ? await interaction.reply(sendOptions) : await message!.reply(sendOptions);
        await sent.react(emoji).catch(() => null);
        const service = ServiceContainer.getService(AutoRoleService) as AutoRoleService;
        await service.addAutoRole({
            guildId: guild.id,
            channelId: channel.id,
            messageId: sent.id,
            emoji,
            roleId: role.id
        });
    }
}
