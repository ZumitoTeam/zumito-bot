// init require
const Discord = require('discord.js');
const {default: localizify, t} = require('localizify');
const { getConfig, saveConfig, getFooter } = require("../../utils/data.js");
const config = require('../../config.js');


// export module
module.exports = {
	name : "lang",
	description : "Change bot lang",
	aliases : ["setlang"],
	ussage : 'lang [<lang shortcode>]',
	examples: ['lang', 'lang en'],
	permissions: ['ADMINISTRATOR'],
	hidden : false,
	admin : true,
	nsfw : false,
	async execute(client,message,args){
		if (args[0] !== undefined) {
			switch (args[0]) {
				case 'en':
				case 'es':
					var settings = await getConfig(message.guild);
					settings.lang = args[0];
					saveConfig(message.guild, settings);
					var string = '';
					switch(settings.lang) {
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
					message.channel.send({
						"embeds": [{
							"title": "",
							"color": config.embeds.color,
							"description": t("Language established to:") + ' ' + string,
							"timestamp": "",
							"author": {},
							"image": {
								"url": ""
							},
							"thumbnail": {
								"url": ""
							},
							"footer": {
								"text": getFooter(message.author.username),
								"icon_url": message.author.avatarURL()
							},
								"fields": []
						}]
					});
					break;
				default:
					message.channel.send(t('Only en, es, ca languages are available'));
					break;
			}
		} else {
			var settings = await getConfig(message.guild);
			var string = '';
			switch(settings.lang) {
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
			message.channel.send({
				"embeds":  [{
					"title": "",
					"color": config.embeds.color,
					"description": t("My current language is:") + ' ' + string,
					"timestamp": "",
					"author": {},
					"image": {
						"url": ""
					},
					"thumbnail": {
						"url": ""
					},
					"footer": {
						"text": getFooter(message.author.username),
						"icon_url": message.author.avatarURL()
					},
						"fields": []
				}]
			});
		}
	}
}