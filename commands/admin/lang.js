const Discord = require('discord.js');
const { default: localizify } = require('localizify');
const { getConfig, saveConfig, getFooter } = require("@modules/utils/data.js");
const botConfig = require('@config/bot.js');
const emoji = require('@config/emojis.js');
require("@modules/localization.js");

module.exports = {
	name: "lang",
	description: "Change bot lang",
	aliases: ["setlang"],
	ussage: 'lang [<lang shortcode>]',
	examples: ['lang', 'lang en'],
	permissions: ['ADMINISTRATOR'],
	category: "Admin",
	hidden: false,
	admin: true,
	nsfw: false,
	async execute(client, message, args) {

		const row = new Discord.ActionRowBuilder()

			.addComponents(

				new Discord.MessageSelectMenu()
					.setCustomId('lenguaje-category')
					.setPlaceholder('command.lang.category'.trans())
					.addOptions([
						{
							label: 'English',
							description: 'Set your language to English-En',
							emoji: '🇺🇸',
							value: 'lang_english',
						},
						{
							label: 'Español',
							description: 'Establece tu idioma a Español-Es',
							emoji: '🇪🇸',
							value: 'lang_spanish',
						},

					]),
			);

		var embed = new Discord.EmbedBuilder()

			.setTitle(emoji.lang + " " + 'command.lang.title'.trans()) // TODO: Menu principal este va de primero para que el usuario cambie el idioma. Y cambiar el idioma por una variable para que salga el idioma actual.
			.setDescription('command.lang.description.0'.trans() + ' `English`' + '\n\n' + 'command.lang.description.1'.trans())
			.setColor(botConfig.embeds.color)

		message.reply({ embeds: [embed], components: [row], allowedMentions: { repliedUser: false } });

		
		/*var embed = new Discord.EmbedBuilder() // TODO: Mensaje de confirmacion cuando cambie de idioma este mensaje va sin componentes de menu
			.setDescription(emoji.check + ' ' + 'command.lang.description.2'.trans() + ' ' + '`Español`')
			.setColor(botConfig.embeds.color)*/

	}
}

/* TODO: Add language selector dropdown when interaction handler is implemented
const row = new Discord.ActionRowBuilder()

			.addComponents(

				new Discord.MessageSelectMenu()
					.setCustomId('lenguaje-category')
					.setPlaceholder('command.lang.category'.trans())
					.addOptions([
						{
							label: 'English',
							description: 'Set your language to English-En',
							emoji: '🇺🇸',
							value: 'lang_english',
						},
						{
							label: 'Español',
							description: 'Establece tu idioma a Español-Es',
							emoji: '🇪🇸',
							value: 'lang_spanish',
						},

					]),
			);

		var embed = new Discord.EmbedBuilder()

			.setTitle(emoji.lang + " " + 'command.lang.title'.trans()) // TODO: Menu principal este va de primero para que el usuario cambie el idioma. Y cambiar el idioma por una variable para que salga el idioma actual.
			.setDescription('command.lang.description.0'.trans() + ' `English`' + '\n\n' + 'command.lang.description.1'.trans())
			.setColor(botConfig.embeds.color)

		message.reply({ embeds: [embed], components: [row], allowedMentions: { repliedUser: false } });

		
		/*var embed = new Discord.EmbedBuilder() // TODO: Mensaje de confirmacion cuando cambie de idioma este mensaje va sin componentes de menu
			.setDescription(emoji.check + ' ' + 'command.lang.description.2'.trans() + ' ' + '`Español`')
			.setColor(botConfig.embeds.color)* / 
*/