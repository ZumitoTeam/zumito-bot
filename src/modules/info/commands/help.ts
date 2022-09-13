import { Command, CommandParameters, ZumitoFramework } from "zumito-framework";
import { ActionRow, ActionRowBuilder, AnyComponentBuilder, CommandInteraction, EmbedBuilder, ImageURLOptions, SelectMenuBuilder, SelectMenuInteraction } from "discord.js";
import { SelectMenuParameters } from "zumito-framework/dist/types/SelectMenuParameters";
import { config } from "../../../config.js";

export class Help extends Command {

    categories = ['info'];
    args: any = [{
        name: "command",
        type: "string",
        required: false
    }]

    execute({ message, interaction, args, client, framework }: CommandParameters): void {
        if (args.has('command')) {
           if (framework.commands.has(args.get('command'))) {
                let command: Command = framework.commands.get(args.get('command'))!;
                const commandEmbed = this.getCommandEmbed(framework, command);
                (message || interaction as unknown as CommandInteraction).reply({ 
                    embeds: [commandEmbed], 
                    allowedMentions: { 
                        repliedUser: false 
                    }
                });
            }
        } else {
            
            const row: any = new ActionRowBuilder().addComponents(this.getCategoriesSelectMenu(framework));

            let text0 = framework.translations.get('command.help.description.0', 'en', { 
                name: config.name
            });
            let text1 = framework.translations.get('command.help.description.1', 'en');
            let text2 = framework.translations.get('command.help.description.2', 'en');

            const embed = new EmbedBuilder()
				.setTitle(framework.translations.get('command.help.title', 'en'))
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

    async selectMenu({ path, interaction, client, framework }: SelectMenuParameters): Promise<void> {
		if (path[1] == "category") {
            let category: string = interaction.values[0];
			let categoryEmbed = new EmbedBuilder()
				.setAuthor({ 
                    name: framework.translations.get('command.help.commands', 'en'), 
                    iconURL: client!.user!.displayAvatarURL() 
                })
				.addFields([{
                    name: category, 
                    value: framework.translations.get('command.help.field.detailed', 'en') + ': ' + '' + '`z-help command`'
                }]);
			let commands: Command[] = Array.from(framework.commands.values()).filter((c: Command) => c.categories.includes(category));
			for(let i = 0; i < commands.length; i++) {
				if(i % 4 == 0) {
					categoryEmbed.addFields([{
                        name: "emoji.book" + ' ' + framework.translations.get('command.help.commands', 'en'), 
                        value: '```'+(commands[i]?.name || '')+'       '+(commands[i+1]?.name || '')+'       '+(commands[i+2]?.name || '')+'       '+(commands[i+3]?.name || '')+'```'
                    }]);
				}
			};
            const row1: any = new ActionRowBuilder().addComponents(this.getCategoriesSelectMenu(framework));
            const row2: any = new ActionRowBuilder().addComponents(this.getCommandsSelectMenu(framework, category));

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
			const commandEmbed = this.getCommandEmbed(framework, command!);
            const row: any = new ActionRowBuilder().addComponents(this.getCategoriesSelectMenu(framework));
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

    getCategoriesSelectMenu(framework: ZumitoFramework): AnyComponentBuilder {
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
                description: framework.translations.get(`command.category.${category}.description`, 'en'),
            }
            if (framework.translations.has(`command.category.${category}.emoji`)) {
                selectMenuOption.emoji = framework.translations.get(`command.category.${category}.emoji`, 'en');
            }
            selectMenuOptions.push(selectMenuOption);
        }
        return new SelectMenuBuilder()
            .setCustomId('help.category')
            .setPlaceholder(framework.translations.get('command.help.category', 'en'))
            .addOptions(selectMenuOptions);
    }

    getCommandsSelectMenu(framework: ZumitoFramework, category: string): AnyComponentBuilder {
        let commands = Array.from(framework.commands.values()).filter((c: Command) => c.categories.includes(category));
        let selectMenuOptions: any = [];
        for (let command of commands) {
            let selectMenuOption: any = {
                label: command.name,
                value: command.name,
                description: framework.translations.get(`command.${command.name}.description`, 'en'),
            }
            if (framework.translations.has(`command.category.${category}.emoji`)) {
                selectMenuOption.emoji = framework.translations.get(`command.category.${category}.emoji`, 'en');
            }
            selectMenuOptions.push(selectMenuOption);
        }
        return new SelectMenuBuilder()
            .setCustomId('help.command')
            .setPlaceholder(framework.translations.get('command.help.command', 'en'))
            .addOptions(selectMenuOptions);
    }

    getCommandEmbed(framework: ZumitoFramework, command: Command): EmbedBuilder {
        return new EmbedBuilder()
        .setAuthor({ 
            name: 'command.help.author.command' + ' ' + 'command.name', 
            iconURL: framework.client.user!.displayAvatarURL(), 
            url: 'https://zumito.ga/commands/' + "help" 
        })
        .setDescription("Command description" + '\n' + framework.translations.get(`command.${command.name}.description`, 'en'))
        .addFields([{
            name: framework.translations.get('command.help.usage', 'en'), 
            value: "uso", // TODO: Ussage
        }, {
            name: framework.translations.get('command.help.examples', 'en'),
            value: "ejemplos", // TODO: ejemplos
        },{
            name: framework.translations.get('command.help.bot_permissions', 'en'),
            value: (command?.botPermissions || []).join(', ') || framework.translations.get('global.none', 'en'),
            inline: true
        }, {
            name: framework.translations.get('command.help.user_permissions', 'en'),
            value: (command?.userPermissions || []).join(', ') || framework.translations.get('global.none', 'en'),
            inline: true
        }])
    }
}