import { StringSelectMenuBuilder } from 'discord.js';

export class HelpSelectMenuBuilderService {
    buildCategoriesSelectMenu(client: any, framework: any, guildSettings: any, emojiFallback: any, selectedCategory?: string): StringSelectMenuBuilder {
        const categories: string[] = [];
        framework.commands.getAll().forEach((command: any) => {
            for (const category of command.categories) {
                if (!categories.includes(category)) {
                    categories.push(category);
                }
            }
        });
        categories.sort();

        const selectMenuOptions: any = [];

        for (const category of categories) {
            const selectMenuOption: any = {
                label: framework.translations.get(`global.category.${category}.name`, guildSettings.lang),
                value: category,
                description: framework.translations.get(`global.category.${category}.description`, guildSettings.lang)
            };

            if (emojiFallback.getEmoji(framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang), framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang))) {
                selectMenuOption.emoji = emojiFallback.getEmoji(
                    framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang),
                    framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang)
                );
            }

            selectMenuOptions.push(selectMenuOption);
        }

        return new StringSelectMenuBuilder()
            .setCustomId("help.category")
            .setPlaceholder(framework.translations.get("command.help.select.category", guildSettings.lang))
            .addOptions(selectMenuOptions);
    }

    buildCommandsSelectMenu(framework: any, category: string, guildSettings: any, emojiFallback: any): StringSelectMenuBuilder {
        let commands = Array.from(framework.commands.getAll().values()).filter((c: any) => c.categories.includes(category));
        // filter commands with same name
        commands = commands.filter((c: any, index: number, self: any[]) =>
            index === self.findIndex((t: any) => t.name === c.name)
        );
        const selectMenuOptions: any = [];
        for (const command of commands) {
            const selectMenuOption: any = {
                label: command.name,
                value: command.name,
                description: framework.translations.get(`command.${command.name}.description`, guildSettings.lang)
            };

            if (emojiFallback.getEmoji(framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang), framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang))) {
                selectMenuOption.emoji = emojiFallback.getEmoji(
                    framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang),
                    framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang)
                );
            }

            selectMenuOptions.push(selectMenuOption);
        }
        return new StringSelectMenuBuilder()
            .setCustomId("help.command")
            .setPlaceholder(framework.translations.get("command.help.select.command", guildSettings.lang))
            .addOptions(selectMenuOptions);
    }
}