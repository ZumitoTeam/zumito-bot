import { Command, CommandParameters } from "zumito-framework";
import { ModerationService } from "../services/ModerationService";
import { ServiceContainer } from "zumito-framework";
import { PermissionsBitField } from "zumito-framework/discord";

export class WarningsCommand extends Command {
    name = "warnings";
    description = "List warnings for a user (admin: any user, others: self).";
    categories = ["moderation"];
    examples = ["@usuario"];
    usage = "warnings [user]";
    userPermissions: bigint[] = [];
    args = [
        { name: "user", type: "user", optional: true }
    ];
    async execute({ message, interaction, args }: CommandParameters) {
        const guild = message?.guild || interaction?.guild;
        if (!guild) return;
        const moderationService = ServiceContainer.getService(ModerationService) as ModerationService;
        const author = message?.member || interaction?.member;
        const isAdmin = author?.permissions?.has?.(PermissionsBitField.Flags.Administrator);
        let target = args.get("user") || (isAdmin ? message?.mentions?.users?.first() : null);
        if (!target) target = message?.author || interaction?.user;
        if (!target) return;
        const warnings = await moderationService.getUserWarnings(guild.id, target.id);
        if (!warnings || warnings.length === 0) {
            const reply = `${target}, has no warnings.`;
            if (message) {
                await message.reply(reply);
            } else if (interaction) {
                await interaction.reply(reply);
            }
            return;
        }
        let reply = `⚠️ Warnings for <@${target.id}>:\n`;
        warnings.forEach((warn: any, i: number) => {
            reply += `#${i + 1} • Moderator: <@${warn.moderatorId}> • Reason: ${warn.reason} • Date: <t:${Math.floor(new Date(warn.date).getTime()/1000)}:f>\n`;
        });
        if (message) {
            await message.reply(reply);
        } else if (interaction) {
            await interaction.reply(reply);
        }
        return;
    }
}
