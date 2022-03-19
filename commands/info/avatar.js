// init require
const Discord = require('discord.js');
const { getBotVersion, getFooter, getTulipoSettings, setTulipoSettings } = require("@modules/utils/data.js");
const {default: localizify, t} = require('localizify');
const botConfig = require('@config/bot.js');

// export module
module.exports = {
	name : "avatar",
	description : "Get user avatar image",
	aliases : [],
	ussage : null,
	hidden : false,
	admin : true,
	nsfw : false,
	async execute(client,message,args){
		let avatar;
		if(message.mentions.users.size > 0){
            avatar = message.mentions.users.first().displayAvatarURL({ dynamic: true, size:1024 });
        } else {
            avatar = message.author.displayAvatarURL({ dynamic: true, size:1024 });
		}
		let user;
		if(message.mentions.users.size > 0){
            user = message.mentions.users.first().username;
        } else {
            user = message.author.username;
		}

		return message.reply({
			"embeds": [{
				"color": botConfig.embeds.color,
				"description": "[Avatar URL]("+avatar+")",
				"author": {
				  "name": t("Avatar of") + ' ' + user,
				  "url": "",
				  "icon_url": avatar
				},
				"image": {
				  "url": avatar
				},
				"footer": {
				  "text": getFooter(message.member.user.tag),
				  "icon_url": message.member.user.displayAvatarURL({dynamic: true, size: 2048} )
				},
			}]
		  });
	}
}