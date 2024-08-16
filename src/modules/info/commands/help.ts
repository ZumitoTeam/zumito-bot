import { ActionRowBuilder, AnyComponentBuilder, CommandInteraction, EmbedBuilder, StringSelectMenuBuilder } from "zumito-framework/discord";
import { Command, CommandParameters, ZumitoFramework, CommandType, SelectMenuParameters, EmojiFallback, ButtonPressedParams, ServiceContainer } from "zumito-framework";
import { config } from "../../../config/index.js";
import { ButtonBuilder, ButtonStyle, Client } from "discord.js";

export class Help extends Command {
    categories = ["information"];
    examples = ["", "ping", "avatar"];
    aliases = ["?", "h"];
    args = [{
        name: "command",
        type: "string",
        optional: true,
    }];
    botPermissions = [ "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS" ];
    userPermissions = [];
    type = CommandType.any;

    client: Client;
    framework: ZumitoFramework;
    emojiFallback: EmojiFallback;

    constructor() {
        super();
        this.client = ServiceContainer.getService(Client.name) as Client;
        this.framework = ServiceContainer.getService(ZumitoFramework.name) as ZumitoFramework;
        this.emojiFallback = ServiceContainer.getService(EmojiFallback) as EmojiFallback;
    }

    execute({ message, interaction, args, guildSettings }: CommandParameters): void {

        if (args.has("command")) {

            if (this.framework.commands.getAll().has(args.get("command"))) {

                const command: Command = this.framework.commands.get(args.get("command"))!;
                const commandRow: any = new ActionRowBuilder().addComponents(this.getCategoriesSelectMenu(this.client, this.framework, guildSettings));
                const commandEmbed = this.getCommandEmbed( this.framework, command, guildSettings );
                (message || (interaction as unknown as CommandInteraction)).reply({
                    embeds: [commandEmbed],
                    components: [commandRow],
                    allowedMentions: {
                        repliedUser: false,
                    },
                });
            }
        } else {
            const closeButton: any = new ButtonBuilder().setCustomId('help.close').setLabel('close').setStyle(ButtonStyle.Danger);
            const row: any = new ActionRowBuilder().addComponents(this.getCategoriesSelectMenu(this.client, this.framework, guildSettings));
            const closeRow: any = new ActionRowBuilder().addComponents(closeButton)
            
            const description = [

                this.framework.translations.get("command.help.greeting.0", guildSettings.lang,
                    {
                        name: this.client!.user!.displayName
                    }
                ) 
                
                + ' ' + this.emojiFallback.getEmoji('', '😊'), '\n' +

                this.framework.translations.get("command.help.greeting.1", guildSettings.lang),
                this.framework.translations.get("command.help.greeting.2", guildSettings.lang) + ' ' +this.emojiFallback.getEmoji('', '🎉'),
                this.framework.translations.get("command.help.greeting.3", guildSettings.lang) + ' ' +this.emojiFallback.getEmoji('', '🎮') + ' ' +this.emojiFallback.getEmoji('', '🤖')
            ];
            
            const embed = new EmbedBuilder()
                .setTitle(this.framework.translations.get("command.help.title", guildSettings.lang))
                .setDescription(description.join('\n'))
                .setColor(config.colors.default);
            
            if (this.client && this.client.user) {
                embed.setThumbnail(
                    this.client.user.displayAvatarURL({ 
                        forceStatic: false, 
                        size: 4096
                    })
                );
            }

            (message || (interaction as unknown as CommandInteraction)).reply({
                embeds: [embed],
                components: [row, closeRow],
                allowedMentions: {
                    repliedUser: false,
                },
            });
        }
    }

    async buttonPressed({ path, interaction }: ButtonPressedParams): Promise<void> {
        if (path[1] == "close") {
            await interaction.message.delete();
        }
    }

    async selectMenu({ path, interaction, client, framework, guildSettings }: SelectMenuParameters): Promise<void> {
       
        if (path[1] == "category") {
            
            const category: string = interaction.values[0];

            const categoryEmbed = new EmbedBuilder()
            
                .setAuthor({
                    name: framework.translations.get("command.help.commands_of", guildSettings.lang,
                        {
                            name: client!.user!.displayName
                        }),
                    iconURL: client!.user!.displayAvatarURL(),
                })

                .addFields({
                    name: this.emojiFallback.getEmoji(framework.translations.get(`global.category.${category}.emoji`), this.framework.translations.get(`global.category.${category}.emoji`))+ ' ' + framework.translations.get(`global.category.${category}.name`, guildSettings.lang),
                    value: framework.translations.get("command.help.field.detailed", guildSettings.lang) + ": " + "" + "`" +
                    this.getPrefix(guildSettings) + "help [command]" + "`" + "\n" + framework.translations.get("command.help.field.support", guildSettings.lang) + " [" + framework.translations.get("command.help.field.support_server", guildSettings.lang) + "](" + config.links.support + ")",
                });
                    
            const commands: Command[] = Array.from(framework.commands.getAll().values()).filter((c: Command) => c.categories.includes(category));
            const valuesToPush: string[] = [];
            for (let i = 0; i < commands.length; i++) {
                if (interaction.values[0] === "information" && i % 4 == 0) { 
                    if (i == 4) {
                        categoryEmbed.addFields(
                            {
                                name: this.emojiFallback.getEmoji('', "📖") + " " + framework.translations.get("command.help.commands", guildSettings.lang),
                                value: "```" + 
                                    (commands[i]?.name || "") + Array(15 - commands[i]?.name.length).fill(" ").join('') + 
                                    (commands[i + 1]?.name || "") + Array(15 - (commands[i + 1]?.name?.length || 0)).fill(" ").join('') + 
                                    (commands[i + 2]?.name || "") + Array(15 - (commands[i + 2]?.name?.length || 0)).fill(" ").join('') + 
                                    (commands[i + 3]?.name || "")
                                    + valuesToPush.join("") + "```",
                            }
                        ).setColor(config.colors.default);
                    }
                    
                    if (i == 0) { 
                        valuesToPush.push(
                            (commands[i]?.name || "") + Array(15 - commands[i]?.name.length).fill(" ").join('') + 
                            (commands[i + 1]?.name || "") + Array(15 - commands[i + 1]?.name.length).fill(" ").join('') + 
                            (commands[i + 2]?.name || "") + Array(15 - commands[i + 2]?.name.length).fill(" ").join('') + 
                            (commands[i + 3]?.name || "")
                        );
                    }
                } else { 
                    if (i % 4 == 0) {
                        categoryEmbed
                            .addFields(
                                {
                                    name: this.emojiFallback.getEmoji('', "📖") + " " + framework.translations.get("command.help.commands", guildSettings.lang),
                                    value: "```" + 
                                (commands[i]?.name || "") + Array(15 - commands[i]?.name.length).fill(" ").join('') + 
                                (commands[i + 1]?.name || "") + Array(15 - (commands[i + 1]?.name?.length || 0)).fill(" ").join('') + 
                                (commands[i + 2]?.name || "") + Array(15 - (commands[i + 2]?.name?.length || 0)).fill(" ").join('') + 
                                (commands[i + 3]?.name || "")
                                + "       " + "```",
                                }
                            )
                            .setColor(config.colors.default);
                    }
                }
            }
                    
            const row1: any = new ActionRowBuilder().addComponents(this.getCategoriesSelectMenu(client, framework, guildSettings, category));
            //await interaction.deferUpdate();
            await interaction.editReply({
                embeds: [categoryEmbed],
                components: [row1],
                allowedMentions: {
                    repliedUser: false
                }
            });
                
        } else if (path[1] == "command") {
                    
            const command: Command | undefined = framework.commands.get(interaction.values[0]);
            
            const commandEmbed = this.getCommandEmbed( framework, command!, guildSettings );
            
            const row: any = new ActionRowBuilder()
                .addComponents(this.getCategoriesSelectMenu(client, framework, guildSettings));
            await interaction.deferUpdate();
            await interaction.editReply({
                embeds: [commandEmbed],
                components: [row],
                allowedMentions: {
                    repliedUser: false
                }
            });
        }
    }
            
    getCategoriesSelectMenu( client: Client, framework: ZumitoFramework, guildSettings: any, selectedCategory?: string ): AnyComponentBuilder {
        const categories: string[] = [];
        framework.commands.getAll().forEach((command: Command) => {
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
                    
            if (this.emojiFallback.getEmoji(framework.translations.get(`command.category.${category}.emoji`), framework.translations.get(`command.category.${category}.emoji`))) {
                selectMenuOption.emoji = this.emojiFallback.getEmoji(
                    framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang), 
                    framework.translations.get(`global.category.${category}.emoji`, guildSettings.lang)
                );
            }
                    
            if (selectedCategory == category) {
                selectMenuOption.default = true;
            }
                    
            selectMenuOptions.push(selectMenuOption);
        }
                
        return new StringSelectMenuBuilder()
            .setCustomId("help.category")
            .setPlaceholder(framework.translations.get("command.help.category", guildSettings.lang))
            .addOptions(selectMenuOptions);
    }
            
    getCommandsSelectMenu(framework: ZumitoFramework, category: string, guildSettings: any): AnyComponentBuilder {
                
        const commands = Array.from(framework.commands.getAll().values()).filter((c: Command) => c.categories.includes(category));
        const selectMenuOptions: any = [];
        for (const command of commands) {
            const selectMenuOption: any = {
                label: command.name,
                value: command.name,
                description: framework.translations.get(`command.${command.name}.description`, guildSettings.lang)
            };
                    
            if (this.emojiFallback.getEmoji(framework.translations.get(`command.category.${category}.emoji`), framework.translations.get(`command.category.${category}.emoji`))) 
            {
                selectMenuOption.emoji = this.emojiFallback.getEmoji(
                    framework.translations.get(`command.category.${category}.emoji`), 
                    framework.translations.get(`command.category.${category}.emoji`)
                );
            }
                    
            selectMenuOptions.push(selectMenuOption);
        }
        return new StringSelectMenuBuilder()
            .setCustomId("help.command")
            .setPlaceholder(framework.translations.get("command.help.select.command", guildSettings.lang))
            .addOptions(selectMenuOptions);
    }
            
    getCommandEmbed( framework: ZumitoFramework, command: Command, guildSettings: any ): EmbedBuilder {
                
        const prefix = this.getPrefix(guildSettings);
        let ussage: string = prefix + command.name + " ";
        if (command.args && command.args.length > 0) {
            for (const arg of command.args) {
                if (arg.optional) {
                    ussage += "<" + framework.translations.get(`command.${command.name}.arguments.${arg.name}.name`, guildSettings.lang) + ">";
                } else {
                    ussage += "[" + framework.translations.get( `command.${command.name}.arguments.${arg.name}.name`, guildSettings.lang ) + "]";
                }
            }
        }
                
        const examples: string[] = [];
        if (command.examples && command.examples.length > 0) {
            for (const example of command.examples) {
                const commandText = command.aliases[Math.floor(Math.random() * command.aliases.length + 1)] || command.name; 
                examples.push(prefix + commandText + " " + example);
            }
        }
        return new EmbedBuilder()
            .setAuthor(
                {
                    name:framework.translations.get("command.help.author.command", guildSettings.lang) + " " + `${command.name}`, 
                    iconURL: framework.client.user!.displayAvatarURL(),
                    url: "https://zumito.ga/commands/" + `${command.name}`
                })
            .setDescription(framework.translations.get(`command.${command.name}.description`, guildSettings.lang))
            .addFields(
                {
                    name: framework.translations.get("command.help.usage", guildSettings.lang),
                    value: "`" + (ussage || framework.translations.get("global.none", guildSettings.lang)) + "`",
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
                    value: (command?.botPermissions || []).map((p) => framework.translations.get(`global.permissions.${p}`)).join("\n") || framework.translations.get("global.none", guildSettings.lang),
                    inline: true,
                },
                {
                    name: framework.translations.get("command.help.permissions.user", guildSettings.lang),
                    value: (command?.userPermissions || []).map((p) => framework.translations.get(`global.permissions.${p}`)).join("\n") || framework.translations.get("global.none", guildSettings.lang),
                    inline: true,
                })
            .setColor(config.colors.default);
    }
    
    getPrefix(guildSettings: any, framework?: ZumitoFramework): string {
        return ( guildSettings?.prefix || process.env.BOT_PREFIX || framework?.settings.defaultPrefix || "!");
    }
}
