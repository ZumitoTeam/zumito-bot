// init require
const Discord = require('discord.js');
const fs = require("fs");
const { getBotVersion, getFooter, getZumitoSettings, setZumitoSettings } = require("@modules/utils/data.js");
var read = require('fs-readdir-recursive')
const commandFiles = read('@commands');//fs.readdirSync('./commands');//.filter(file => file.endsWith('.js'));
const owner = process.env.OWNER;
const prefix = process.env.BOTPREFIX;
const { t } = require('localizify');
const { sendTimedMessage } = require("@modules/utils/messages.js");
const { tn } = require('@modules/utils/utils.js');
const botConfig = require('@config/bot.js');
const emoji = require('@config/emojis.js');
require("@modules/localization.js");

// export module
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

	// TODO: entire command
	async execute(client, message, args) {


		const row = new Discord.MessageActionRow()

			.addComponents(

				new Discord.MessageSelectMenu()
					.setCustomId('help-category')
					.setPlaceholder('command.help.category'.trans())
					.addOptions([
						{
							label: 'Admin',
							description: 'View commands in' + ' Admin ' + 'category',
							value: 'admin_category',
							emoji: "⚙"
						},
						{
							label: 'Utility',
							description: 'View commands in Utility category',
							value: 'utility_category',
							emoji: "🛠"
						},
					]),
			);


		const embed = new Discord.MessageEmbed()

			.setTitle('command.help.title'.trans())
			.setDescription('command.help.description.0'.trans() + ' ' + botConfig.name + "\n\n" + 'command.help.description.1'.trans() + "\n" + 'command.help.description.2'.trans() + "\n")
			.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
			.setColor(botConfig.embeds.color)


		const commandInfo = new Discord.MessageEmbed()

			.setAuthor({ name: 'command.help.author.command'.trans() + ' ' + 'command.name', iconURL: client.user.displayAvatarURL(), url: 'https://zumito.ga/commands/' + "help" })
			.setDescription("Command descripcion")
			.addField('command.help.usage'.trans(), "uso")
			.addField('command.help.examples'.trans(), "ejemplos")
			.addField('command.help.bot_permissions'.trans(), "permisos", true)
			.addField('command.help.user_permissions'.trans(), "permisos", true)
			.setColor(botConfig.embeds.color)

		const category = new Discord.MessageEmbed()

			.setAuthor({ name: 'command.help.commands'.trans() + ' ' + botConfig.name, iconURL: client.user.displayAvatarURL() })
			.addField('⚙ Admin', 'command.help.field.detailed'.trans() + ': ' + '' + '`z-help command`')
			.addField(emoji.book + ' ' + 'command.help.commands'.trans(), '```Lang       Prefix       Example       Example```')
			.setColor(botConfig.embeds.color)



		return message.reply({ embeds: [embed, commandInfo, category], allowedMentions: { repliedUser: false }, components: [row] });
		//components: [row]
	}
}
