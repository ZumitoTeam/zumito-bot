const Discord = require('discord.js');
const { default: localizify, t } = require('localizify');
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

		if (args[0] !== undefined) {
			switch (args[0]) {
				case 'en':
				case 'es':
					var settings = await getConfig(message.guild);
					settings.lang = args[0];
					saveConfig(message.guild, settings);
					var string = '';
					switch (settings.lang) {
						case 'es':
							string = ':flag_es: Español - Es';
							break;
						case 'en':
							string = ':flag_us: English - En';
							break;
						case 'ca':
							string = '<:Catalonia:833140848198811678> Català - Ca';
							break;
					}
					localizify.setLocale(settings.lang || 'en');

					const embed = new Discord.MessageEmbed()

						.setColor(botConfig.embeds.color)
						.setDescription(t("My language has been set to:") + ' ' + string)

					message.reply({ allowedMentions: { repliedUser: false }, embeds: [embed] });

					break;
				default:
					message.reply(t('Only en, es, ca languages are available'));
					break;
			}
		} else {
			var settings = await getConfig(message.guild);
			var string = '';
			switch (settings.lang) {
				case 'es':
					string = ':flag_es: Español - Es';
					break;
				case 'en':
					string = ':flag_us: English - En';
					break;
				case 'ca':
					string = '<:Catalonia:833140848198811678> Català - Ca';
					break;
			}

			const embed = new Discord.MessageEmbed()

				.setColor(botConfig.embeds.color)
				.setDescription(t("My current language is:") + ' ' + string)

			message.reply({ allowedMentions: { repliedUser: false }, embeds: [embed] });
		}
	}
}

/* TODO: Add language selector dropdown when interaction handler is implemented
const row = new Discord.MessageActionRow()

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

		var embed = new Discord.MessageEmbed()

			.setTitle(emoji.lang + " " + 'command.lang.title'.trans()) // TODO: Menu principal este va de primero para que el usuario cambie el idioma. Y cambiar el idioma por una variable para que salga el idioma actual.
			.setDescription('command.lang.description.0'.trans() + ' `English`' + '\n\n' + 'command.lang.description.1'.trans())
			.setColor(botConfig.embeds.color)

		message.reply({ embeds: [embed], components: [row], allowedMentions: { repliedUser: false } });

		
		/*var embed = new Discord.MessageEmbed() // TODO: Mensaje de confirmacion cuando cambie de idioma este mensaje va sin componentes de menu
			.setDescription(emoji.check + ' ' + 'command.lang.description.2'.trans() + ' ' + '`Español`')
			.setColor(botConfig.embeds.color)* / 
*/