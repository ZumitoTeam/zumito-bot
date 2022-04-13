// init require
const Discord = require('discord.js');
const { default: localizify, t } = require('localizify');
const { getConfig, saveConfig, getFooter } = require("@modules/utils/data.js");
const botConfig = require('@config/bot.js');
//test

// export module
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