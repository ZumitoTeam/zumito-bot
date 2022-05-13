// init require
const Discord = require('discord.js');
const { getFooter } = require("@modules/utils/data.js");
const { t } = require('localizify');
const botConfig = require('@config/bot.js');

// export module
module.exports = {
	name: "avatar",
	description: "Get user avatar image",
	aliases: [],
	category: "Info",
	ussage: null,
	hidden: false,
	admin: false,
	nsfw: false,

	async execute(client, message, args) {
		let avatar;
		// TODO: Search for user although it is not in that guild.
		if (message.mentions.users.size > 0) {
			avatar = message.mentions.users.first().displayAvatarURL({ dynamic: true, size: 1024 });
		} else {
			avatar = message.author.displayAvatarURL({ dynamic: true, size: 1024 });
		}
		let user;
		if (message.mentions.users.size > 0) {
			user = message.mentions.users.first().username;
		} else {
			user = message.author.username;
		}

		const embed = new Discord.MessageEmbed()

			.setAuthor({ name: 'command.prefix.author'.trans() + ' ' + user, iconURL: "" })
			.setDescription("[Avatar URL](" + avatar + ")")
			.setImage(avatar)
			.setColor(botConfig.embeds.color)
			.setFooter({ text: getFooter(message.member.user.tag), iconURL: message.author.avatarURL() })
			.setTimestamp();

		return message.reply({embeds: [embed], allowedMentions: {repliedUser: false}
		});
	}
} 