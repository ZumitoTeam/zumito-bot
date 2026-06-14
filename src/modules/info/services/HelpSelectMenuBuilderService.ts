import { StringSelectMenuBuilder, Client } from 'discord.js';
import { Command, EmojiFallback, ZumitoFramework } from 'zumito-framework';

export class HelpSelectMenuBuilderService {

    private getCategoryEmoji(category: string, framework: ZumitoFramework, guildSettings: { lang: string }, emojiFallback: EmojiFallback): string | null {
        const emojiId = framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang);
        const emoji = emojiFallback.getEmoji(emojiId, emojiId);
        return emoji || null;
    }

    buildCategoriesSelectMenu(client: Client, framework: ZumitoFramework, guildSettings: { lang: string }, emojiFallback: EmojiFallback, selectedCategory?: string): StringSelectMenuBuilder {
        const t = (key: string) => framework.translations.get(key, guildSettings.lang);

        // Collect all unique categories from registered commands
        const categories: string[] = [];
        framework.commands.getAll().forEach((command: Command) => {
            for (const cat of command.categories) {
                if (!categories.includes(cat)) {
                    categories.push(cat);
                }
            }
        });
        categories.sort();

        const options: { label: string; value: string; description: string; emoji?: string }[] = [];
        for (const category of categories) {
            if (category === 'premium') continue;

            const option: { label: string; value: string; description: string; emoji?: string } = {
                label: t(`global.category.${category}.name`),
                value: category,
                description: t(`global.category.${category}.description`),
            };

            const emoji = this.getCategoryEmoji(category, framework, guildSettings, emojiFallback);
            if (emoji) {
                option.emoji = emoji;
            }

            options.push(option);
        }

        const placeholder = selectedCategory
            ? `${this.getCategoryEmoji(selectedCategory, framework, guildSettings, emojiFallback) || ''} ${t(`global.category.${selectedCategory}.name`)}`.trim()
            : t("command.help.select.category");

        return new StringSelectMenuBuilder()
            .setCustomId("help.category")
            .setPlaceholder(placeholder)
            .addOptions(options);
    }

    buildCommandsSelectMenu(framework: ZumitoFramework, category: string, guildSettings: { lang: string }, emojiFallback: EmojiFallback): StringSelectMenuBuilder {
        const t = (key: string) => framework.translations.get(key, guildSettings.lang);

        const commands = Array.from(framework.commands.getAll().values())
            .filter((c: Command) => c.categories.includes(category))
            .filter((c: Command, index: number, self: Command[]) =>
                index === self.findIndex((t: Command) => t.name === c.name)
            );

        const options: { label: string; value: string; description: string; emoji?: string }[] = [];
        for (const command of commands) {
            const option: { label: string; value: string; description: string; emoji?: string } = {
                label: command.name,
                value: command.name,
                description: t(`command.${command.name}.description`),
            };

            const emoji = this.getCategoryEmoji(category, framework, guildSettings, emojiFallback);
            if (emoji) {
                option.emoji = emoji;
            }

            options.push(option);
        }

        return new StringSelectMenuBuilder()
            .setCustomId("help.command")
            .setPlaceholder(t("command.help.select.command"))
            .addOptions(options);
    }
}
