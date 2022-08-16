const Discord = require('discord.js');
const fs = require("fs");
const { getBotVersion, getFooter, getZumitoSettings, setZumitoSettings } = require("@modules/utils/data.js");
var read = require('fs-readdir-recursive')
const commandFiles = read('@commands');//fs.readdirSync('./commands');//.filter(file => file.endsWith('.js'));
const owner = process.env.OWNER;
const prefix = process.env.BOTPREFIX;
const { sendTimedMessage } = require("@modules/utils/messages.js");
const { tn } = require('@modules/utils/utils.js');
const botConfig = require('@config/bot.js');
const emoji = require('@config/emojis.js');
require("@modules/localization.js");

module.exports = {
	name: "help",
	description: "tulipo help command",
	aliases: ["?", "h"],
	ussage: "help [<command>]",
	examples: ['help', 'help userinfo'],
	hidden: false,
	admin: false,
	nsfw: false,
	DM: true,
	slashCommand: true,
	args: [{
		name: "command",
		description: "The command to get help for",
		optional: true,
	}],

	// TODO: entire command
	async execute(client, message, args) {

		let command = args.get('command')?.value;
		if (command) {
			command = client.commands.find(c => c.name === command);
			const embed = new Discord.EmbedBuilder()
				.setAuthor({ name: 'command.help.author.command'.trans() + ' ' + 'command.name', iconURL: client.user.displayAvatarURL(), url: 'https://zumito.ga/commands/' + "help" })
				.setDescription("Command description")
				.addField('command.help.usage'.trans(), command.name)
				.addField('command.help.examples'.trans(), command.examples?.[0] || 'Not defined')
				.addField('command.help.bot_permissions'.trans(), command.permissions?.[0] || 'generic.none'.trans(), true)
				.addField('command.help.user_permissions'.trans(), command.permissions?.[0] || 'generic.none'.trans(), true)
				.setColor(botConfig.embeds.color)
			return message.reply({ 
				embeds: [embed], 
				allowedMentions: { 
					repliedUser: false 
				}
			});
		} else {
			const row = new Discord.ActionRowBuilder()
				.addComponents(
					new Discord.MessageSelectMenu()
						.setCustomId('help.category')
						.setPlaceholder('command.help.category'.trans())
						.addOptions([
							{
								label: 'Admin',
								description: 'View commands in' + ' Admin ' + 'category',
								value: 'admin',
								emoji: "⚙"
							},
							{
								label: 'Fun',
								description: 'View commands in Fun category',
								value: 'fun',
								emoji: "🛠"
							},
						]),
				);

			
			const embed = new Discord.EmbedBuilder()
				.setTitle('command.help.title'.trans())
				.setDescription('command.help.description.0'.trans() + ' ' + botConfig.name + "\n\n" + 'command.help.description.1'.trans() + "\n" + 'command.help.description.2'.trans() + "\n")
				.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
				.setColor(botConfig.embeds.color)

			return message.reply({ 
				embeds: [embed], 
				components: [row],
				allowedMentions: { 
					repliedUser: false 
				}
			});
		}
	},

	async selectMenu(path, interaction, client) {
		if (path[1] == "category") {
			let category = new Discord.EmbedBuilder()
				.setAuthor({ name: 'command.help.commands'.trans() + ' ' + botConfig.name, iconURL: client.user.displayAvatarURL() })
				.addField(interaction.values[0], 'command.help.field.detailed'.trans() + ': ' + '' + '`z-help command`')
				.setColor(botConfig.embeds.color);
			
			let commands = Array.from(client.commands.filter(c => c.category == interaction.values[0]));
			for(let i = 0; i < commands.length; i++) {
				if(i % 4 == 0) {
					category.addField(emoji.book + ' ' + 'command.help.commands'.trans(), '```'+(commands[i]?.[1]?.name || '')+'       '+(commands[i+1]?.[1]?.name || '')+'       '+(commands[i+2]?.[1]?.name || '')+'       '+(commands[i+3]?.[1]?.name || '')+'```')
				}
			};

			await interaction.deferUpdate();
			return await interaction.editReply({ 
				embeds: [category],
				allowedMentions: { 
					repliedUser: false 
				}
			});
		} else if(path[1] == "command") {
			// TODO: command info
			const commandInfo = new Discord.EmbedBuilder()
			.setAuthor({ name: 'command.help.author.command'.trans() + ' ' + 'command.name', iconURL: client.user.displayAvatarURL(), url: 'https://zumito.ga/commands/' + "help" })
			.setDescription("Command description")
			.addField('command.help.usage'.trans(), "uso")
			.addField('command.help.examples'.trans(), "ejemplos")
			.addField('command.help.bot_permissions'.trans(), "permisos", true)
			.addField('command.help.user_permissions'.trans(), "permisos", true)
			.setColor(botConfig.embeds.color)
		}
	}
}