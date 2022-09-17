import { Command, CommandParameters, ZumitoFramework } from "zumito-framework";
import { ActionRow, ActionRowBuilder, AnyComponentBuilder, CommandInteraction, EmbedBuilder, ImageURLOptions, SelectMenuBuilder, SelectMenuInteraction } from "discord.js";
import { SelectMenuParameters } from "zumito-framework/dist/types/SelectMenuParameters";
import { config } from "../../../config.js";

export class Help extends Command {

    categories = ['info'];
    examples: string[] = ["", "ping"];
    args: any = [{
        name: "command",
        type: "string",
        required: false
    }]

    execute({ message, interaction, args, client, framework, guildSettings }: CommandParameters): void {
        if (args.has('command')) {
           if (framework.commands.has(args.get('command'))) {
                let command: Command = framework.commands.get(args.get('command'))!;
                const commandEmbed = this.getCommandEmbed(framework, command, guildSettings);
                (message || interaction as unknown as CommandInteraction).reply({ 
                    embeds: [commandEmbed], 
                    allowedMentions: { 
                        repliedUser: false 
                    }
                });
            }
        } else {
            
            const row: any = new ActionRowBuilder().addComponents(this.getCategoriesSelectMenu(framework, guildSettings));

            let text0 = framework.translations.get('command.help.description.0', guildSettings.lang, { 
                name: config.name
            });
            let text1 = framework.translations.get('command.help.description.1', guildSettings.lang);
            let text2 = framework.translations.get('command.help.description.2', guildSettings.lang);

            const embed = new EmbedBuilder()
				.setTitle(framework.translations.get('command.help.title', guildSettings.lang))
				.setDescription(
                    text0 + "\n\n" + 
                    text1 + "\n" + 
                    text2 + "\n"
                );

            if (client && client.user) {
                embed.setThumbnail(client.user.displayAvatarURL({ forceStatic: false }))
            }

			(message || interaction as unknown as CommandInteraction).reply({ 
				embeds: [embed], 
				components: [row],
				allowedMentions: { 
					repliedUser: false 
				}
			});
        }
    }

    async selectMenu({ path, interaction, client, framework, guildSettings }: SelectMenuParameters): Promise<void> {
		if (path[1] == "category") {
            let category: string = interaction.values[0];
			let categoryEmbed = new EmbedBuilder()
				.setAuthor({ 
                    name: framework.translations.get('command.help.commands', guildSettings.lang), 
                    iconURL: client!.user!.displayAvatarURL() 
                })
				.addFields([{
                    name: category, 
                    value: framework.translations.get('command.help.field.detailed', guildSettings.lang) + ': ' + '' + this.getPrefix(guildSettings) + '`help command`'
                }]);
			let commands: Command[] = Array.from(framework.commands.values()).filter((c: Command) => c.categories.includes(category));
			for(let i = 0; i < commands.length; i++) {
				if(i % 4 == 0) {
					categoryEmbed.addFields([{
                        name: "emoji.book" + ' ' + framework.translations.get('command.help.commands', guildSettings.lang), 
                        value: '```'+(commands[i]?.name || '')+'       '+(commands[i+1]?.name || '')+'       '+(commands[i+2]?.name || '')+'       '+(commands[i+3]?.name || '')+'```'
                    }]);
				}
			};
            const row1: any = new ActionRowBuilder().addComponents(this.getCategoriesSelectMenu(framework, guildSettings));
            const row2: any = new ActionRowBuilder().addComponents(this.getCommandsSelectMenu(framework, category, guildSettings));

			await interaction.deferUpdate();
			await interaction.editReply({ 
				embeds: [categoryEmbed],
                components: [row1, row2],
				allowedMentions: { 
					repliedUser: false 
				}
			});
		} else if(path[1] == "command") {
            let command: Command | undefined = framework.commands.get(interaction.values[0]);
			const commandEmbed = this.getCommandEmbed(framework, command!, guildSettings);
            const row: any = new ActionRowBuilder().addComponents(this.getCategoriesSelectMenu(framework, guildSettings));
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

    getCategoriesSelectMenu(framework: ZumitoFramework, guildSettings: any): AnyComponentBuilder {
        let categories: string[] = [];
        framework.commands.forEach((command: Command) => {
            for (let category of command.categories) {
                if (!categories.includes(category)) {
                    categories.push(category);
                }
            }
        });

        let selectMenuOptions: any = [];
        for (let category of categories) {
            let selectMenuOption: any = {
                label: category,
                value: category,
                description: framework.translations.get(`command.category.${category}.description`, guildSettings.lang),
            }
            if (framework.translations.has(`command.category.${category}.emoji`)) {
                selectMenuOption.emoji = framework.translations.get(`command.category.${category}.emoji`, guildSettings.lang);
            }
            selectMenuOptions.push(selectMenuOption);
        }
        return new SelectMenuBuilder()
            .setCustomId('help.category')
            .setPlaceholder(framework.translations.get('command.help.category', guildSettings.lang))
            .addOptions(selectMenuOptions);
    }

    getCommandsSelectMenu(framework: ZumitoFramework, category: string, guildSettings: any): AnyComponentBuilder {
        let commands = Array.from(framework.commands.values()).filter((c: Command) => c.categories.includes(category));
        let selectMenuOptions: any = [];
        for (let command of commands) {
            let selectMenuOption: any = {
                label: command.name,
                value: command.name,
                description: framework.translations.get(`command.${command.name}.description`, guildSettings.lang),
            }
            if (framework.translations.has(`command.category.${category}.emoji`)) {
                selectMenuOption.emoji = framework.translations.get(`command.category.${category}.emoji`, guildSettings.lang);
            }
            selectMenuOptions.push(selectMenuOption);
        }
        return new SelectMenuBuilder()
            .setCustomId('help.command')
            .setPlaceholder(framework.translations.get('command.help.command', guildSettings.lang))
            .addOptions(selectMenuOptions);
    }

    getCommandEmbed(framework: ZumitoFramework, command: Command, guildSettings: any): EmbedBuilder {
        let prefix = this.getPrefix(guildSettings);
        let ussage: string = prefix + command.name + ' ';
        if (command.args && command.args.length > 0) {
            for (let arg of command.args) {
                if (arg.required) {
                    ussage += '<' + arg.name + '> ';
                } else {
                    ussage += '[' + arg.name + '] ';
                }
            }
        }
        let examples: string[] = [];
        if (command.examples && command.examples.length > 0) {
            for (let example of command.examples) {
                let commandText = command.aliases[Math.floor(Math.random() * (command.aliases.length) + 1)] || command.name;
                examples.push(prefix + commandText + ' ' + example);
            }
        }
        return new EmbedBuilder()
        .setAuthor({ 
            name: 'command.help.author.command' + ' ' + 'command.name', 
            iconURL: framework.client.user!.displayAvatarURL(), 
            url: 'https://zumito.ga/commands/' + "help" 
        })
        .setDescription("Command description" + '\n' + framework.translations.get(`command.${command.name}.description`, guildSettings.lang))
        .addFields([{
            name: framework.translations.get('command.help.usage', guildSettings.lang), 
            value: ussage || framework.translations.get('command.help.usage.none', guildSettings.lang),
        }, {
            name: framework.translations.get('command.help.examples', guildSettings.lang),
            value: examples.join('\n') || framework.translations.get('command.help.noExamples', guildSettings.lang),
        },{
            name: framework.translations.get('command.help.bot_permissions', guildSettings.lang),
            value: (command?.botPermissions || []).join(', ') || framework.translations.get('global.none', guildSettings.lang),
            inline: true
        }, {
            name: framework.translations.get('command.help.user_permissions', guildSettings.lang),
            value: (command?.userPermissions || []).join(', ') || framework.translations.get('global.none', guildSettings.lang),
            inline: true
        }])
    }

    getPrefix(guildSettings: any): string {
        console.log(guildSettings?.prefix || process.env.BOTPREFIX || config.prefix);
        return guildSettings?.prefix || process.env.BOTPREFIX || config.prefix
    }
}