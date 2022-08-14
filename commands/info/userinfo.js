// init require
const Discord = require('discord.js');
const botConfig = require("@config/bot.js");
const { default: localizify, t } = require('localizify');
var moment = require('moment');
const fs = require('fs');
var { image_search } = require('duckduckgo-images-api');
var remote = require('remote-file-size')
const { getBotVersion, getFooter, getTulipoSettings, setTulipoSettings } = require("@modules/utils/data.js");
const emojis = require('@config/emojis.js');
require("@modules/localization.js");

// export module
module.exports = {
	name: "userinfo",
	description: "Check user info",
	aliases: ['user'],
	ussage: 'userinfo [<user mention>]',
	examples: ['userinfo', 'userinfo @Zumito'],
	hidden: false,
	admin: false,
	nsfw: false,
	async execute(client, message, args) {

		let user = message.mentions.users.first() || message.author;
		let member = message.mentions.members.first() || message.member;

		let game;
		if (member.presence.activities[1] != undefined) {
			game = member.presence.activities[1].name;
		} else if (member.presence.activities[0] != undefined) {
			game = member.presence.activities[0].name;
		} else {
			game = 'command.userinfo.not_playing'.trans();
		}

		const embed = new Discord.EmbedBuilder()

			.setTitle('command.userinfo.title'.trans()) //emoji.info + ' ' + 
			.setThumbnail(user.avatarURL({ dynamic: true }))
			.setDescription('**' + 'command.userinfo.user'.trans() + ':** ' + `${user.username}` + '#' + `${user.discriminator}` + '\n**' + 'command.userinfo.nickname'.trans() + ':** ' + `${member.nickname || 'command.userinfo.no_nickname'.trans()}` + '\n**' + 'command.userinfo.id'.trans() + ':** ' + `${user.id}` + '\n**' + 'command.userinfo.color'.trans() + ':** ' + `${user.hexAccentColor}` + '\n**' + 'command.userinfo.playing'.trans() + ':** ' + game)
			//.setImage(user.bannerURL({ dynamic: true })) // TODO: Hacerlo funcional el banner
			.addField('command.userinfo.creation'.trans() + ': ', 'Agregar el fecha')
			.addField('command.userinfo.login'.trans() + ': ', 'Fecha')
			.addField('command.userinfo.roles'.trans() + ': ', `${member.roles.cache.map(m => m).join(" • ")}`) //TODO: agregar mensaje Sin roles cuando no tenga ningun rol
			.setColor(botConfig.embeds.color)
			.setFooter({ text: getFooter(message.member.user.tag), iconURL: message.author.avatarURL({ dynamic: true }) })

		return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

	}


}