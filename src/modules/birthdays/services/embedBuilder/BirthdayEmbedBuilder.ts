import { EmbedBuilder, Guild, User } from "zumito-framework/discord";
import { ZumitoFramework } from "zumito-framework";
import { config } from "../../../../config/index.js";

export class BirthdayEmbedBuilder {
    buildGuildBirthdayEmbed(framework: ZumitoFramework, guild: Guild, user: User, entry: { month: number; day: number; year?: number | null }, lang: string): EmbedBuilder {
        const t = (k: string, vars?: Record<string, any>) => framework.translations.get(`command.birthday.${k}`, lang, vars);

        const dateStr = this.formatDate(entry);
        const title = t('embed.title', { user: user.username });
        const desc = t('embed.description', { date: dateStr });
        const embed = new EmbedBuilder()
            .setColor(config.colors.default)
            .setTitle(title)
            .setDescription(desc)
            .setThumbnail(user.displayAvatarURL({ forceStatic: false, size: 512 }));
        return embed;
    }

    private formatDate(entry: { month: number; day: number; year?: number | null }): string {
        const d = String(entry.day).padStart(2, '0');
        const m = String(entry.month).padStart(2, '0');
        if (entry.year) return `${d}/${m}/${entry.year}`;
        return `${d}/${m}`;
    }
}
