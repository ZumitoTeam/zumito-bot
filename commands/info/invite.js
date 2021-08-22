// init require
const Discord = require('discord.js');
const { getFooter } = require("../../utils/data.js");
const {default: localizify, t} = require('localizify');

// export module
module.exports = {
	name : "invite",
	description : "Get tulipo invite urls",
	aliases : [],
	ussage : null,
	hidden : false,
	admin : true,
	nsfw : false,
	async execute(client,message,args){
		return message.author.send({
			"embeds":  [{
				"color": 16711680,
				"description": t("Here is the invitation link so that I can join any server you manage.") + "<:tulipo_happy:813820074359521320>\n**"+t("Invitation")+"**:\n**-** ["+t("Invitation")+"](https://tulipo.ga/invite) **-**\n\n**"+t("Note")+":**\n**1**. "+t("It is recommended to leave the `Administrator` permission enabled to avoid any future conflicts with permissions.")+"\n**2**. "+t('You must have the `Server administration` permission enabled on the server where you want to invite Tulipo.'),
				"timestamp": "",
				"url": "",
				"author": {
				  "name": t("Invitation"),
				  "url": "",
				  "icon_url": "https://media.discordapp.net/attachments/813104993091190814/813819667255787570/tulipo_happy.png"
				},
				"image": {
				  "url": ""
				},
				"thumbnail": {
				  "url": "https://media.discordapp.net/attachments/813104993091190814/813819667255787570/tulipo_happy.png"
				},
				"footer": {
					"text": getFooter(message.member.user.tag),
					"icon_url": message.member.user.displayAvatarURL({dynamic: true} )
				},
			  }]
		  });
	}
}
