import { StringSelectMenuBuilder, Client } from 'discord.js';
import { Command, EmojiFallback, ZumitoFramework, ServiceContainer } from 'zumito-framework';

export class HelpSelectMenuBuilderService {

    constructor(
        private emojiFallback = ServiceContainer.getService(EmojiFallback)
    ) {}

    private async getCategoryEmoji(category: string, framework: ZumitoFramework, guildSettings: { lang: string }): Promise<string | null> {
        const emojiId = framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang);
        const emoji = await this.emojiFallback.getEmoji('', emojiId);
        return emoji || null;
    }

    async buildCategoriesSelectMenu(client: Client, framework: ZumitoFramework, guildSettings: { lang: string }, selectedCategory?: string): Promise<StringSelectMenuBuilder> {
        const t = (key: string) => framework.translations.get(key, guildSettings.lang);

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

            const emoji = await this.getCategoryEmoji(category, framework, guildSettings);
            if (emoji) {
                option.emoji = emoji;
            }

            options.push(option);
        }

        const placeholder = selectedCategory
            ? `${await this.getCategoryEmoji(selectedCategory, framework, guildSettings) || ''} ${t(`global.category.${selectedCategory}.name`)}`.trim()
            : t("command.help.select.category");

        return new StringSelectMenuBuilder()
            .setCustomId("help.category")
            .setPlaceholder(placeholder)
            .addOptions(options);
    }

    async buildCommandsSelectMenu(framework: ZumitoFramework, category: string, guildSettings: { lang: string }): Promise<StringSelectMenuBuilder> {
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

            const emoji = await this.getCategoryEmoji(category, framework, guildSettings);
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
