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
					.setCustomId('select')
					.setPlaceholder('Select a category')
					.addOptions([
						{
							label: 'Admin',
							description: 'View commands in Admin category',
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
			.setColor(botConfig.embeds.color)
			.setTitle('Help Menu')
			.setDescription("Hello i am " + botConfig.name + "\n\n" + t("I am a multipurpose bot in charge of this service.") + "\n" + t("What are you waiting for? Select a category to have fun together." + "\n"))
			.setThumbnail(client.user.displayAvatarURL())



		const commandInfo = new Discord.MessageEmbed()
			.setColor(botConfig.embeds.color)
			.setAuthor({ name: 'Command', iconURL: client.user.displayAvatarURL(), url: 'https://zumito.ga/' + "help" })
			.setDescription("Command descripcion")
			.addField("Usage", "uso")
			.addField("Examples", "ejemplos")
			.addField("Bot permissions", "permisos",true)
			.addField("User permissions", "permisos", true)
			//.setFooter({ text: 'Command category: ' + "Category", iconURL: "" })
			//.setTimestamp()

		const category = new Discord.MessageEmbed()
			.setColor(botConfig.embeds.color)
			.setAuthor({ name: 'Commands ' + botConfig.name, iconURL: client.user.displayAvatarURL() })
			.addField("⚙ Admin", "For more detailed information use: " + "\n" + "For additional help, visit our")
			.addField("📖 Commands", "┕ " + "[cluster](https://zumito.ga/help)" + "\n" + "┕ " + "[avatar](https://zumito.ga/avatar)")



		return message.reply({ allowedMentions: { repliedUser: false }, embeds: [category], components: [row] });
		//components: [row]
	}
}
