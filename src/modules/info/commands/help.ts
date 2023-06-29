import {
    ActionRow,
    ActionRowBuilder,
    AnyComponentBuilder,
    CommandInteraction,
    EmbedBuilder,
    ImageURLOptions,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
} from "discord.js";
import {
    Command,
    CommandParameters,
    ZumitoFramework,
    CommandType,
} from "zumito-framework";
import { SelectMenuParameters } from "zumito-framework/dist/types/SelectMenuParameters";
import { config } from "../../../config/index.js";
import { type } from "os";

export class Help extends Command {
    categories = ["information"];
    examples: string[] = ["", "ping"];
    aliases = ["?", "h"];
    args: any = [
        {
            name: "command",
            type: "string",
            optional: true,
        },
    ];
    botPermissions = [
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "EMBED_LINKS",
        "USE_EXTERNAL_EMOJIS",
    ];
    type = CommandType.any;

    execute({
        message,
        interaction,
        args,
        client,
        framework,
        guildSettings,
    }: CommandParameters): void {
        if (args.has("command")) {
            if (framework.commands.has(args.get("command"))) {
                let command: Command = framework.commands.get(
                    args.get("command")
                )!;
                const row1: any = new ActionRowBuilder().addComponents(
                    this.getCategoriesSelectMenu(framework, guildSettings)
                );
                const commandEmbed = this.getCommandEmbed(
                    framework,
                    command,
                    guildSettings
                );
                (
                    message || (interaction as unknown as CommandInteraction)
                ).reply({
                    embeds: [commandEmbed],
                    components: [row1],
                    allowedMentions: {
                        repliedUser: false,
                    },
                });
            }
        } else {
            const row: any = new ActionRowBuilder().addComponents(
                this.getCategoriesSelectMenu(framework, guildSettings)
            );

            let text0 = framework.translations.get(
                "command.help.greeting.0",
                guildSettings.lang,
                {
                    name: config.global.name,
                }
            );
            let text1 = framework.translations.get(
                "command.help.greeting.1",
                guildSettings.lang
            );
            let text2 = framework.translations.get(
                "command.help.greeting.2",
                guildSettings.lang
            );

            const embed = new EmbedBuilder()
                .setTitle(
                    framework.translations.get(
                        "command.help.title",
                        guildSettings.lang
                    )
                )
                .setDescription(text0 + "\n\n" + text1 + "\n" + text2 + "\n")
                .setColor(config.global.embeds.color);

            if (client && client.user) {
                embed.setThumbnail(
                    client.user.displayAvatarURL({ forceStatic: false })
                );
            }

            (message || (interaction as unknown as CommandInteraction)).reply({
                embeds: [embed],
                components: [row],
                allowedMentions: {
                    repliedUser: false,
                },
            });
        }
    }

    async selectMenu({
        path,
        interaction,
        client,
        framework,
        guildSettings,
    }: SelectMenuParameters): Promise<void> {
        if (path[1] == "category") {
            let category: string = interaction.values[0];
            let categoryEmbed = new EmbedBuilder()
                .setAuthor({
                    name: framework.translations.get(
                        "command.help.commands_of",
                        guildSettings.lang,
                        {
                            name: config.global.name,
                        }
                    ),
                    iconURL: client!.user!.displayAvatarURL(),
                })

                .addFields([
                    {
                        name: category,
                        value:
                            framework.translations.get(
                                "command.help.field.detailed",
                                guildSettings.lang
                            ) +
                            ": " +
                            "" +
                            "`" +
                            this.getPrefix(guildSettings) +
                            "help [command]" +
                            "`" +
                            "\n" +
                            framework.translations.get(
                                "command.help.field.support",
                                guildSettings.lang
                            ) +
                            " [" +
                            framework.translations.get(
                                "command.help.field.support_server",
                                guildSettings.lang
                            ) +
                            "](" +
                            config.global.supportServerURL +
                            ")",
                    },
                ]);
            let commands: Command[] = Array.from(
                framework.commands.values()
            ).filter((c: Command) => c.categories.includes(category));
            let valuesToPush: string[] = [];
            for (let i = 0; i < commands.length; i++) {
                if (interaction.values[0] === "information" && i % 4 == 0) {
                    i == 4 &&
                        categoryEmbed
                            .addFields([
                                {
                                    name:
                                        "📖" +
                                        " " +
                                        framework.translations.get(
                                            "command.help.commands",
                                            guildSettings.lang
                                        ),
                                    value:
                                        "```" +
                                        (commands[i]?.name || "") +
                                        "       " +
                                        (commands[i + 1]?.name || "") +
                                        "       " +
                                        (commands[i + 2]?.name || "") +
                                        "       " +
                                        (commands[i + 3]?.name || "") +
                                        "       " +
                                        valuesToPush.join("") +
                                        "```",
                                },
                            ])

                            .setColor(config.global.embeds.color);
                    i == 0 &&
                        valuesToPush.push(
                            (commands[i]?.name || "") +
                                "       " +
                                (commands[i + 1]?.name || "") +
                                "       " +
                                (commands[i + 2]?.name || "") +
                                "       " +
                                (commands[i + 3]?.name || "")
                        );
                } else {
                    if (i % 4 == 0) {
                        categoryEmbed
                            .addFields([
                                {
                                    name:
                                        "📖" +
                                        " " +
                                        framework.translations.get(
                                            "command.help.commands",
                                            guildSettings.lang
                                        ),
                                    value:
                                        "```" +
                                        (commands[i]?.name || "") +
                                        "       " +
                                        (commands[i + 1]?.name || "") +
                                        "       " +
                                        (commands[i + 2]?.name || "") +
                                        "       " +
                                        (commands[i + 3]?.name || "") +
                                        "       " +
                                        "```",
                                },
                            ])

                            .setColor(config.global.embeds.color);
                    }
                }
            }
            const row1: any = new ActionRowBuilder().addComponents(
                this.getCategoriesSelectMenu(framework, guildSettings, category)
            );
            await interaction.deferUpdate();
            await interaction.editReply({
                embeds: [categoryEmbed],
                components: [row1],
                allowedMentions: {
                    repliedUser: false,
                },
            });
        } else if (path[1] == "command") {
            let command: Command | undefined = framework.commands.get(
                interaction.values[0]
            );
            const commandEmbed = this.getCommandEmbed(
                framework,
                command!,
                guildSettings
            );
            const row: any = new ActionRowBuilder().addComponents(
                this.getCategoriesSelectMenu(framework, guildSettings)
            );
            await interaction.deferUpdate();
            await interaction.editReply({
                embeds: [commandEmbed],
                components: [row],
                allowedMentions: {
                    repliedUser: false,
                },
            });
        }
    }

    getCategoriesSelectMenu(
        framework: ZumitoFramework,
        guildSettings: any,
        selectedCategory?: string
    ): AnyComponentBuilder {
        let categories: string[] = [];
        framework.commands.forEach((command: Command) => {
            for (let category of command.categories) {
                if (!categories.includes(category)) {
                    categories.push(category);
                }
            }
        });
        categories.sort();

        let selectMenuOptions: any = [];
        for (let category of categories) {
            let selectMenuOption: any = {
                label: framework.translations.get(
                    `global.category.${category}.name`,
                    guildSettings.lang
                ),
                value: category,
                description: framework.translations.get(
                    `global.category.${category}.description`,
                    guildSettings.lang
                ),
            };
            if (
                framework.translations.has(`command.category.${category}.emoji`)
            ) {
                selectMenuOption.emoji = framework.translations.get(
                    `global.category.${category}.emoji`,
                    guildSettings.lang
                );
            }
            if (selectedCategory == category) {
                selectMenuOption.default = true;
            }
            selectMenuOptions.push(selectMenuOption);
        }
        return new StringSelectMenuBuilder()
            .setCustomId("help.category")
            .setPlaceholder(
                framework.translations.get(
                    "command.help.category",
                    guildSettings.lang
                )
            )
            .addOptions(selectMenuOptions);
    }

    getCommandsSelectMenu(
        framework: ZumitoFramework,
        category: string,
        guildSettings: any
    ): AnyComponentBuilder {
        let commands = Array.from(framework.commands.values()).filter(
            (c: Command) => c.categories.includes(category)
        );
        let selectMenuOptions: any = [];
        for (let command of commands) {
            let selectMenuOption: any = {
                label: command.name,
                value: command.name,
                description: framework.translations.get(
                    `command.${command.name}.description`,
                    guildSettings.lang
                ),
            };
            if (
                framework.translations.has(`command.category.${category}.emoji`)
            ) {
                selectMenuOption.emoji = framework.translations.get(
                    `command.category.${category}.emoji`,
                    guildSettings.lang
                );
            }
            selectMenuOptions.push(selectMenuOption);
        }
        return new StringSelectMenuBuilder()
            .setCustomId("help.command")
            .setPlaceholder(
                framework.translations.get(
                    "command.help.select.command",
                    guildSettings.lang
                )
            )
            .addOptions(selectMenuOptions);
    }

    getCommandEmbed(
        framework: ZumitoFramework,
        command: Command,
        guildSettings: any
    ): EmbedBuilder {
        let prefix = this.getPrefix(guildSettings);
        let ussage: string = prefix + command.name + " ";
        if (command.args && command.args.length > 0) {
            for (let arg of command.args) {
                if (arg.optional) {
                    ussage +=
                        "<" +
                        framework.translations.get(
                            `command.${command.name}.arguments.${arg.name}.name`,
                            guildSettings.lang
                        ) +
                        ">";
                } else {
                    ussage +=
                        "[" +
                        framework.translations.get(
                            `command.${command.name}.arguments.${arg.name}.name`,
                            guildSettings.lang
                        ) +
                        "]";
                }
            }
        }
        let examples: string[] = [];
        if (command.examples && command.examples.length > 0) {
            for (let example of command.examples) {
                let commandText =
                    command.aliases[
                        Math.floor(Math.random() * command.aliases.length + 1)
                    ] || command.name;
                examples.push(prefix + commandText + " " + example);
            }
        }
        return new EmbedBuilder()
            .setAuthor({
                name:
                    framework.translations.get(
                        "command.help.author.command",
                        guildSettings.lang
                    ) +
                    " " +
                    `${command.name}`,
                iconURL: framework.client.user!.displayAvatarURL(),
                url: "https://zumito.ga/commands/" + `${command.name}`,
            })
            .setDescription(
                framework.translations.get(
                    `command.${command.name}.description`,
                    guildSettings.lang
                )
            )
            .addFields([
                {
                    name: framework.translations.get(
                        "command.help.usage",
                        guildSettings.lang
                    ),
                    value:
                        "`" +
                        (ussage ||
                            framework.translations.get(
                                "global.none",
                                guildSettings.lang
                            )) +
                        "`",
                },
                {
                    name: framework.translations.get(
                        "command.help.examples",
                        guildSettings.lang
                    ),
                    value:
                        examples.join("\n") ||
                        framework.translations.get(
                            "command.help.noExamples",
                            guildSettings.lang
                        ),
                },
                {
                    name: framework.translations.get(
                        "command.help.aliases",
                        guildSettings.lang
                    ),
                    value:
                        command.aliases.join(", ") ||
                        framework.translations.get(
                            "global.none",
                            guildSettings.lang
                        ),
                },
                {
                    name: framework.translations.get(
                        "command.help.permissions.bot",
                        guildSettings.lang
                    ),
                    value:
                        (command?.botPermissions || [])
                            .map((p) =>
                                framework.translations.get(
                                    `global.permissions.${p}`
                                )
                            )
                            .join("\n") ||
                        framework.translations.get(
                            "global.none",
                            guildSettings.lang
                        ),
                    inline: true,
                },
                {
                    name: framework.translations.get(
                        "command.help.permissions.user",
                        guildSettings.lang
                    ),
                    value:
                        (command?.userPermissions || [])
                            .map((p) =>
                                framework.translations.get(
                                    `global.permissions.${p}`
                                )
                            )
                            .join("\n") ||
                        framework.translations.get(
                            "global.none",
                            guildSettings.lang
                        ),
                    inline: true,
                },
            ])
            .setColor(config.global.embeds.color);
    }

    getPrefix(guildSettings: any, framework?: ZumitoFramework): string {
        return (
            guildSettings?.prefix ||
            process.env.BOTPREFIX ||
            framework?.settings.defaultPrefix ||
            "!"
        );
    }
}
