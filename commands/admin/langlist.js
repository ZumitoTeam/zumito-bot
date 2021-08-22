// init require
const Discord = require('discord.js');
const {t} = require('localizify');
const { getFooter } = require("../../utils/data.js");
const config = require('../../config.js');


// export module
module.exports = {
	name : "langlist",
	description : "List bot available languages",
	aliases : ["langs"],
	ussage : 'langlist',
	examples: ['langlist'],
	hidden : false,
	admin : true,
	nsfw : false,
	async execute(client,message,args){
		message.channel.send({
			"embeds": [{
				"title": t("Available languages:"),
				"color": config.embeds.color,
				"description": ":flag_es: Español - Es\n:flag_us: English - En\n<:Catalonia:833140848198811678> Català - Ca",
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