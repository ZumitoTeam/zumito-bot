import { EmbedBuilder } from 'discord.js';
import { config } from '../../../config/index.js';

export class HelpEmbedBuilderService {
    buildHelpEmbed(client: any, framework: any, guildSettings: any, emojiFallback: any): EmbedBuilder {
        const description = [
            `${framework.translations.get("command.help.greeting.0", guildSettings.lang).replace("{name}", client!.user!.displayName)} ${emojiFallback.getEmoji('', '😊')}`,
            `\n${framework.translations.get("command.help.greeting.1", guildSettings.lang)}`,
            `${framework.translations.get("command.help.greeting.2", guildSettings.lang)} ${emojiFallback.getEmoji('', '🎉')}`,
            `${framework.translations.get("command.help.greeting.3", guildSettings.lang)} ${emojiFallback.getEmoji('', '🎮')} ${emojiFallback.getEmoji('', '🤖')}`
        ];

        const embed = new EmbedBuilder()
            .setTitle(framework.translations.get("command.help.title", guildSettings.lang))
            .setDescription(description.join('\n'))
            .setColor(config.colors.default);

        if (client && client.user) {
            embed.setThumbnail(client.user.displayAvatarURL({ forceStatic: false, size: 4096 }));
        }

        return embed;
    }

    buildCategoryEmbed(client: any, category: string, commands: any[], framework: any, guildSettings: any, emojiFallback: any, prefix: string): EmbedBuilder {
        const categoryEmbed = new EmbedBuilder()
            .setAuthor({
                name: framework.translations.get("command.help.commands_of", guildSettings.lang).replace("{name}", client!.user!.displayName),
                iconURL: client!.user!.displayAvatarURL(),
            })
            .addFields({
                name: `${emojiFallback.getEmoji(framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang), framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang))} ${framework.translations.get(`global.category.${category}.name`, guildSettings.lang)}`,
                value: `${framework.translations.get("command.help.field.detailed", guildSettings.lang)}: \`${prefix}help [<command>]\`\n${framework.translations.get("command.help.field.support", guildSettings.lang)} [${framework.translations.get("command.help.field.support_server", guildSettings.lang)}](${config.links.support})`,
            })
            .setColor(config.colors.default);

        // Add commands fields as in the original code
        const valuesToPush: string[] = [];
        for (let i = 0; i < commands.length; i++) {
            if (category === "information" && i % 4 === 0) {
                if (i === 4) {
                    categoryEmbed.addFields({
                        name: `${emojiFallback.getEmoji('', "📖")} ${framework.translations.get("command.help.commands", guildSettings.lang)}`,
                        value: `\`\`\`${commands[i]?.name || ""}${Array(15 - (commands[i]?.name?.length || 0)).fill(" ").join('')}${commands[i + 1]?.name || ""}${Array(15 - (commands[i + 1]?.name?.length || 0)).fill(" ").join('')}${commands[i + 2]?.name || ""}${Array(15 - (commands[i + 2]?.name?.length || 0)).fill(" ").join('')}${commands[i + 3]?.name || ""}${valuesToPush.join("")}\`\`\``,
                    });
                }
                if (i === 0) {
                    valuesToPush.push(
                        (commands[i]?.name || "") + Array(15 - (commands[i]?.name?.length || 0)).fill(" ").join('') +
                        (commands[i + 1]?.name || "") + Array(15 - (commands[i + 1]?.name?.length || 0)).fill(" ").join('') +
                        (commands[i + 2]?.name || "") + Array(15 - (commands[i + 2]?.name?.length || 0)).fill(" ").join('') +
                        (commands[i + 3]?.name || "")
                    );
                }
            } else {
                if (i % 4 === 0) {
                    categoryEmbed.addFields({
                        name: `${emojiFallback.getEmoji('', "📖")} ${framework.translations.get("command.help.commands", guildSettings.lang)}`,
                        value: `\`\`\`${commands[i]?.name || ""}${Array(15 - (commands[i]?.name?.length || 0)).fill(" ").join('')}${commands[i + 1]?.name || ""}${Array(15 - (commands[i + 1]?.name?.length || 0)).fill(" ").join('')}${commands[i + 2]?.name || ""}${Array(15 - (commands[i + 2]?.name?.length || 0)).fill(" ").join('')}${commands[i + 3]?.name || ""}\`\`\``,
                    });
                }
            }
        }

        return categoryEmbed;
    }

    buildCommandEmbed(framework: any, command: any, trans: any): EmbedBuilder {
        const prefix = framework?.settings.defaultPrefix || "!";
        let usage: string = `${prefix + command.name} `;
        if (command.args && command.args.length > 0) {
            for (const arg of command.args) {
                if (arg.optional) {
                    usage += `<${framework.translations.get(`command.${command.name}.arguments.${arg.name}.name`, guildSettings.lang)}>`;
                } else {
                    usage += `[${framework.translations.get(`command.${command.name}.arguments.${arg.name}.name`, guildSettings.lang)}]`;
                }
            }
        }

        const examples: string[] = [];
        if (command.examples && command.examples.length > 0) {
            for (const example of command.examples) {
                examples.push(`${prefix + command.name} ${example}`);
            }
        }

        return new EmbedBuilder()
            .setAuthor({
                name: `${framework.translations.get("command.help.author.command", guildSettings.lang)} ${command.name}`,
                iconURL: framework.client.user!.displayAvatarURL(),
                url: "https://zumito.ga/commands/" + command.name
            })
            .setDescription(framework.translations.get(`command.${command.name}.description`, guildSettings.lang))
            .addFields(
                {
                    name: framework.translations.get("command.help.usage", guildSettings.lang),
                    value: `\`${usage || framework.translations.get("global.none", guildSettings.lang)}\``,
                },
                {
                    name: framework.translations.get("command.help.examples", guildSettings.lang),
                    value: examples.join("\n") || framework.translations.get("command.help.noExamples", guildSettings.lang)
                },
                {
                    name: framework.translations.get("command.help.aliases", guildSettings.lang),
                    value: command.aliases.join(", ") || framework.translations.get("global.none", guildSettings.lang)
                },
                {
                    name: framework.translations.get("command.help.permissions.bot", guildSettings.lang),
                    value: (command?.botPermissions || []).map((p) => framework.translations.get(`global.permissions.${p}`, guildSettings.lang)).join("\n") || framework.translations.get("global.none", guildSettings.lang),
                    inline: true,
                },
                {
                    name: framework.translations.get("command.help.permissions.user", guildSettings.lang),
                    value: (command?.userPermissions || []).map((p) => framework.translations.get(`global.permissions.${p}`, guildSettings.lang)).join("\n") || framework.translations.get("global.none", guildSettings.lang),
                    inline: true,
                })
            .setColor(config.colors.default);
    }
}