// init require
const Discord = require('discord.js');
const {t} = require('localizify');
const { getConfig, saveConfig, getFooter } = require("../../utils/data.js");


// export module
module.exports = {
	name : "prefix",
	description : "Change/check bot prefix",
	aliases : ["setprefix"],
	ussage : 'prefix [<new prefix>]',
	examples: ['prefix', 'prefix tl-'],
	permissions: ['ADMINISTRATOR'],
	hidden : false,
	admin : true,
	nsfw : false,
	async execute(client,message,args){
		var settings = await getConfig(message.guild);
		if (args.length == 0) {
			return message.reply(`The current prefix is `+ '`' + settings.prefix + '`');
		} else {
			settings.prefix = args[0];
			saveConfig(message.guild, settings);
			return message.reply({
				"embeds":  [{
				  "title": "",
				  "color": 16711680,
				  "description": "<:tulipo_happy:813820074359521320> **" + t("The prefix has been changed.") + "**\n"+t("The bot prefix has been changed on this server.")+"\n" + t("New Prefix: {prefix}", {prefix: '`'+args[0]+'`'}) + " \n\n**"+t("IMPORTANT NOTE")+"**: \n" + t("Remember to use the prefix exactly as you typed it, otherwise the bot will not respond.") + "\n"+ t("Example: {command}.", {command: '`'+settings.prefix+'help`'}),
				  "timestamp": "",
				  "author": {},
				  "image": {},
				  "thumbnail": {
					"url": ""
				  },
				  "footer": {
					"text": getFooter(message.member.user.tag || message.user.username ),
					"icon_url": message.author.avatarURL()
				  },
				  "fields": []
				}]
			});
		}
		
	}
}