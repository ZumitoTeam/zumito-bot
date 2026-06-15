import { EmbedBuilder, Client } from 'discord.js';
import { Command, EmojiFallback, ZumitoFramework, ServiceContainer } from 'zumito-framework';
import { config } from '../../../../config/index.js';

type GuildSettings = { lang: string; prefix?: string };

type CommandWithPremium = Command & { premium?: boolean };

export class HelpEmbedBuilderService {

    constructor(
        private emojiFallback = ServiceContainer.getService(EmojiFallback)
    ) {}

    async buildHelpEmbed(client: Client, framework: ZumitoFramework, guildSettings: GuildSettings): Promise<EmbedBuilder> {
        const t = (key: string) => framework.translations.get(key, guildSettings.lang);

        const description = [
            `${t("command.help.greeting.0").replace("{name}", client!.user!.displayName)} ${await this.emojiFallback.getEmoji('', '😊')}`,
            `\n${t("command.help.greeting.1")}`,
            `${t("command.help.greeting.2")} ${await this.emojiFallback.getEmoji('', '🎉')}`,
            `${t("command.help.greeting.3")} ${await this.emojiFallback.getEmoji('', '🎮')} ${await this.emojiFallback.getEmoji('', '🤖')}`
        ];

        const embed = new EmbedBuilder()
            .setTitle(t("command.help.title"))
            .setDescription(description.join('\n'))
            .setColor(config.colors.default);

        if (client?.user) {
            embed.setThumbnail(client.user.displayAvatarURL({ forceStatic: false, size: 4096 }));
        }

        return embed;
    }

    async buildCategoryEmbed(client: Client, category: string, commands: Command[], framework: ZumitoFramework, guildSettings: GuildSettings, prefix: string): Promise<EmbedBuilder> {
        const t = (key: string) => framework.translations.get(key, guildSettings.lang);

        const categoryEmbed = new EmbedBuilder()
            .setAuthor({
                name: t("command.help.commands_of").replace("{name}", client!.user!.displayName),
                iconURL: client!.user!.displayAvatarURL(),
            })
            .addFields({
                name: `${await this.emojiFallback.getEmoji('', t(`global.category.${category}.emoji`))} ${t(`global.category.${category}.name`)}`,
                value: `${t("command.help.field.detailed")}: \`${prefix}help [<command>]\`\n${t("command.help.field.support")} [${t("command.help.field.support_server")}](${config.links.support})`,
            })
            .setColor(config.colors.default);

        this.addCommandsGrid(categoryEmbed, commands, `${await this.emojiFallback.getEmoji('', '⭐')} ${t("command.help.commands")}`, false);

        const premiumCommands = Array.from(framework.commands.getAll().values())
            .filter((c: CommandWithPremium) => c.premium === true && c.categories.includes(category))
            .filter((c: CommandWithPremium, index: number, self: CommandWithPremium[]) =>
                index === self.findIndex((t: CommandWithPremium) => t.name === c.name)
            );

        if (premiumCommands.length > 0) {
            this.addCommandsGrid(
                categoryEmbed,
                premiumCommands,
                `${await this.emojiFallback.getEmoji('', '⭐')} ${t('global.category.premium.name')}`,
                true
            );
        }

        return categoryEmbed;
    }

    private addCommandsGrid(embed: EmbedBuilder, commands: Command[], fieldName: string, isPremium: boolean): void {
        commands.sort((a: Command, b: Command) => (a?.name || "").localeCompare(b?.name || ""));

        const colWidth = commands.reduce((max, c) => Math.max(max, (c?.name || "").length), 0) + 2;
        const rows: string[] = [];

        for (let i = 0; i < commands.length; i += 4) {
            const chunk = commands.slice(i, i + 4);
            const row = chunk.map((c: Command) => {
                const padded = (c?.name || "").padEnd(colWidth);
                return isPremium ? `\x1b[32m${padded}\x1b[0m` : padded;
            }).join("");
            rows.push(row);
        }

        const codeLang = isPremium ? 'ansi' : '';
        embed.addFields({
            name: fieldName,
            value: `\`\`\`${codeLang}\n${rows.join("\n")}\`\`\``,
        });
    }

    async buildCommandEmbed(framework: ZumitoFramework, command: Command, guildSettings: GuildSettings, prefix: string): Promise<EmbedBuilder> {
        const t = (key: string) => framework.translations.get(key, guildSettings.lang);

        let usage = `${prefix + command.name}`;
        if (command.args?.length > 0) {
            for (const arg of command.args) {
                const argName = t(`command.${command.name}.arguments.${arg.name}.name`);
                usage += arg.optional ? ` <${argName}>` : ` [${argName}]`;
            }
        }

        const examples: string[] = [];
        if (command.examples?.length > 0) {
            for (const example of command.examples) {
                const full = example ? `${prefix + command.name} ${example}` : prefix + command.name;
                examples.push(full);
            }
        }

        let categoryName = t("global.none");
        if (command.categories?.length > 0) {
            categoryName = t(`global.category.${command.categories[0]}.name`);
        }

        let parentName = "";
        if (command.parent) {
            const parentCmd = framework.commands.get(command.parent);
            parentName = parentCmd ? `${prefix}${command.parent}` : command.parent;
        }

        const subcommands = Array.from(framework.commands.getAll().values())
            .filter((c: Command) => c.parent === command.name)
            .map((c: Command) => c.name)
            .sort();

        const embed = new EmbedBuilder()
            .setTitle(`${t("command.help.author.command")} ${command.name}`)
            .setDescription(t(`command.${command.name}.description`))
            .addFields(
                {
                    name: t("command.help.usage"),
                    value: `\`${usage}\``,
                },
                {
                    name: t("command.help.examples"),
                    value: examples.join("\n") || t("command.help.noExamples"),
                },
                {
                    name: t("command.help.aliases"),
                    value: command.aliases.join(", ") || t("global.none"),
                },
                {
                    name: t("command.help.category"),
                    value: categoryName,
                });

        if (parentName) {
            embed.addFields({
                name: t("command.help.parent"),
                value: `\`${parentName}\``,
            });
        }

        if (subcommands.length > 0) {
            const colWidth = subcommands.reduce((max, n) => Math.max(max, n.length), 0) + 2;
            const rows: string[] = [];
            for (let i = 0; i < subcommands.length; i += 4) {
                const chunk = subcommands.slice(i, i + 4);
                rows.push(chunk.map((n) => n.padEnd(colWidth)).join(""));
            }
            embed.addFields({
                name: `${await this.emojiFallback.getEmoji('', '📂')} ${t("command.help.subcommands")}`,
                value: `\`\`\`${rows.join("\n")}\`\`\``,
            });
        }

        embed.addFields(
            {
                name: t("command.help.permissions.bot"),
                value: (command?.botPermissions || []).map((p: string) => t(`global.permissions.${p}`)).join("\n") || t("global.none"),
                inline: true,
            },
            {
                name: t("command.help.permissions.user"),
                value: (command?.userPermissions || []).map((p: bigint) => t(`global.permissions.${p}`)).join("\n") || t("global.none"),
                inline: true,
            })
            .setColor(config.colors.default);

        return embed;
    }
}
