const Discord = require('discord.js');
const botConfig = require("@config/bot.js");
const { getFooter } = require("@modules/utils/data.js");
const emoji = require('@config/emojis.js');
require("@modules/localization.js");

module.exports = {
	name: "userinfo",
	aliases: ['user'],
	examples: ['userinfo', 'userinfo @Zumito'],
	ussage: 'userinfo [<user mention>]',
	hidden: false,
	admin: false,
	nsfw: false,
	cooldown: 0,
	dm: true,

	async execute(client, message, args) {

		let user = message.mentions.users.first() || message.author ;
		let member = message.mentions.members.first() || message.member;

		let game;
		if (member.presence.activities[1] != undefined) {
			game = member.presence.activities[1].name;
		} else if (member.presence.activities[0] != undefined) {
			game = member.presence.activities[0].name;
		} else {
			game = 'command.userinfo.not_playing'.trans();
		}

		const embed = new Discord.MessageEmbed()

			.setTitle('command.userinfo.title'.trans())
			.setThumbnail(user.avatarURL({ dynamic: true }))
			.setDescription('**' + 'command.userinfo.user'.trans() + ':** ' + `${user.username}` + '#' + `${user.discriminator}` + '\n**' + 'command.userinfo.nickname'.trans() + ':** ' + `${member.nickname || 'command.userinfo.no_nickname'.trans()}` + '\n**' + 'command.userinfo.id'.trans() + ':** ' + `${user.id}` + '\n**' + 'command.userinfo.color'.trans() + ':** ' + `${member.displayHexColor}` + '\n**' + 'command.userinfo.playing'.trans() + ':** ' + game)
			.addField('command.userinfo.creation'.trans() + ': ', `<t:${Math.floor(member.user.createdAt / 1000)}:d>` + ' (' + `<t:${Math.floor(member.user.createdAt / 1000)}:R>` + ')')
			.addField('command.userinfo.login'.trans() + ': ', `<t:${Math.floor(member.joinedAt / 1000)}:d>` + ' (' + `<t:${Math.floor(member.joinedAt / 1000)}:R>` + ')')
			.addField('command.userinfo.roles'.trans() + ': ', `${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `<@&${roles.id }>`).join(" • ") || 'command.userinfo.noRoles'.trans()}`)
			.setColor(botConfig.embeds.color)
			.setFooter({ text: getFooter((message.author || message.member.user).tag), iconURL: (message.author || message.user).avatarURL({ dynamic: true }) })

		return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

	}


}