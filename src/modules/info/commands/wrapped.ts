import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, Client } from "zumito-framework/discord";
import { Command, CommandArgDefinition, CommandParameters, CommandType } from "zumito-framework";
import { config } from "../../../config/index.js";

export class Wrapped extends Command {
    categories = ["information"];
    examples: string[] = [""];
    args: CommandArgDefinition[] = [];
    botPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"];
    type = CommandType.any;

    async execute({ message, interaction, framework, guildSettings, trans }: CommandParameters): Promise<void> {
        const guildId = interaction?.guild?.id || message?.guild?.id;
        if (!guildId) return;

        const startOfYear = new Date(new Date().getFullYear(), 0, 1);

        const pollModel = (framework.database.models as any)?.Poll;
        const polls = pollModel ? await pollModel.find({ where: { guildId } }).catch(() => []) : [];
        const pollCount = polls.filter((p: any) => new Date(p.createdAt) >= startOfYear).length;

        const ticketModel = (framework.database.models as any)?.Ticket;
        const tickets = ticketModel ? await ticketModel.find({ where: { guildId } }).catch(() => []) : [];
        const ticketCount = tickets.filter((t: any) => new Date(t.createdAt) >= startOfYear).length;

        const logModel = (framework.database.models as any)?.ModerationLog;
        const logs = logModel ? await logModel.find({ where: { guildId } }).catch(() => []) : [];
        const moderationCount = logs.filter((l: any) => new Date(l.date) >= startOfYear).length;

        const rankModel = (framework.database.models as any)?.RankUser;
        const topUsers = rankModel ? await rankModel.find({
            where: { guildId },
            order: ["xp", "DESC"],
            limit: 3
        }).catch(() => []) : [];

        let galleryAttachment: AttachmentBuilder | null = null;
        if (topUsers.length > 0) {
            const { createCanvas, loadImage } = await import("canvas");
            const client = framework.client as Client;
            const width = topUsers.length * 180;
            const height = 180;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#2b2d31";
            ctx.fillRect(0, 0, width, height);

            for (const [index, user] of topUsers.entries()) {
                const x = index * 180 + 40;
                const member = client.users.cache.get(user.userId);
                const avatarUrl = member?.displayAvatarURL({ extension: "png", size: 128 });
                if (avatarUrl) {
                    const img = await loadImage(avatarUrl);
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(x + 50, 50, 40, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(img, x + 10, 10, 80, 80);
                    ctx.restore();
                }
                ctx.fillStyle = "#ffffff";
                ctx.font = "14px sans-serif";
                ctx.fillText(`#${index + 1}`, x + 10, 110);
                ctx.fillText(`${user.xp} XP`, x + 10, 130);
            }
            galleryAttachment = new AttachmentBuilder(canvas.toBuffer(), { name: "wrapped.png" });
        }

        const embed = new EmbedBuilder()
            .setTitle(trans("title", { year: new Date().getFullYear() }))
            .addFields(
                { name: trans("polls"), value: String(pollCount), inline: true },
                { name: trans("tickets"), value: String(ticketCount), inline: true },
                { name: trans("moderation"), value: String(moderationCount), inline: true }
            )
            .setColor(config.colors.default);

        let components: any[] = [];
        if (topUsers.length > 0) {
            embed.addFields({
                name: trans("topUsers"),
                value: topUsers.map((u: any, i: number) => `${i + 1}. <@${u.userId}> - ${u.xp} XP`).join("\n")
            });

            const previous = new ButtonBuilder()
                .setCustomId("wrapped.prev")
                .setLabel(trans("button.previous"))
                .setStyle(ButtonStyle.Secondary);
            const next = new ButtonBuilder()
                .setCustomId("wrapped.next")
                .setLabel(trans("button.next"))
                .setStyle(ButtonStyle.Secondary);
            components.push(new ActionRowBuilder().addComponents(previous, next));
        } else {
            embed.addFields({ name: trans("topUsers"), value: trans("noData") });
        }

        const replyOptions: any = {
            embeds: [embed],
            allowedMentions: { repliedUser: false }
        };
        if (galleryAttachment) {
            embed.addFields({ name: trans("galleryTitle"), value: "\u200B" });
            embed.setImage("attachment://wrapped.png");
            replyOptions.files = [galleryAttachment];
        }
        if (components.length > 0) {
            replyOptions.components = components;
        }

        (message || interaction!)?.reply(replyOptions);
    }
}
