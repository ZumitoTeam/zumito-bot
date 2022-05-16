// init require
const Discord = require('discord.js');
const botConfig = require("@config/bot.js");
const { default: localizify, t } = require('localizify');
var moment = require('moment');
const fs = require('fs');
var { image_search } = require('duckduckgo-images-api');
var remote = require('remote-file-size')
const { getBotVersion, getFooter, getTulipoSettings, setTulipoSettings } = require("@modules/utils/data.js");
const emoji = require('@config/emojis.js');
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
			game = 'Is not playing';
		}

		var state = member.presence.clientStatus;
		if (state !== undefined && state != null) {
			if (state.mobile === undefined) state.mobile = 'offline';
			if (state.desktop === undefined) state.desktop = 'offline';
			if (state.web === undefined) state.web = 'offline';
			if (state.mobile == 'online' || state.desktop == 'online' || state.web == 'online') {
				state = emoji.online + ' ' + 'Online';
			} else if (state.mobile == 'streaming' || state.desktop == 'streaming' || state.web == 'streaming') {
				state = emoji.streaming + ' ' + 'In streaming';
			} else if (state.mobile == 'dnd' || state.desktop == 'dnd' || state.web == 'dnd') {
				state = emoji.dnd + ' ' + 'Do not disturb';
			} else if (state.mobile == 'idle' || state.desktop == 'idle' || state.web == 'idle') {
				state = emoji.idle + ' ' + 'Idle';
			} else {
				state = emoji.offline + ' ' + 'Offline';
			}
		} else {
			state = ':robot: Bot';
		}
		let platforms = [];
		if (member.presence.clientStatus !== undefined && member.presence.clientStatus != null) {
			Object.keys(member.presence.clientStatus).forEach(function (key) {
				if (member.presence.clientStatus[key] != 'offline') {
					platforms.push(t(key));
				}
			});
		}


		const embed = new Discord.MessageEmbed()

			.setTitle(emoji.cozysip + ' ' + 'User information')
			.setThumbnail(user.avatarURL({ dynamic: true }))
			.setDescription('Nombre' + ': ' + `\**${user.username}` + '#' + `${user.discriminator}\**` + '\n' + 'Nickname' + ': ' + `\**${member .nickname || 'Sin apodo'}\**` + '\n' + 'ID' + ': ' + `\**${user.id}\**`)
			.addField('State', state, true)
			.addField('Playing at', game, true)
			.addField('Connected in', platforms.join(' | ') || 'none', true)
			.setColor(botConfig.embeds.color)
			.setFooter({ text: getFooter(message.member.user.tag), iconURL: message.author.avatarURL({ dynamic: true }) })

		return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

		/*.addField('Name' + ":", user.username, true)
					.addField('Discriminator' + ":", '#' + user.discriminator, true)
				if (user.username != member.displayName) {
					embed.addField('Nickname' + ":", member.displayName);
				}
				embed
					.addField('User ID' + ":", `${user.id}`);
				if (!user.bot) {
					embed.addField('State' + ":", state, true);
				}
				embed
					.addField('Playing at' + ":", game, true)
					.addField('¿Person or Bot?' + ":", user.bot ? ":robot: " + 'Bot' : " " + 'Person');
				if (!user.bot) {
					embed.addField('Connected in' + ":", platforms.join(' | ') || t('none'));
				}
				embed
					.addField('Account creation' + ":", timeDifference(new Date(user.createdTimestamp), new Date(Date.now())))
					.addField('Date of admission' + ":", timeDifference(new Date(member.joinedTimestamp), new Date(Date.now())))
					.setColor(botConfig.embeds.color)
					.addField('Roles' + ":", `${member.roles.cache.map(m => m).join(" • ")}`)*/
	}

}

function timeDifference(date1, date2) {
	var totalDifference = difference;
	var difference = date1.getTime() - date2.getTime();

	var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
	difference -= daysDifference * 1000 * 60 * 60 * 24

	var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
	difference -= hoursDifference * 1000 * 60 * 60

	var minutesDifference = Math.floor(difference / 1000 / 60);
	difference -= minutesDifference * 1000 * 60

	var secondsDifference = Math.floor(difference / 1000);

	daysDifference = daysDifference * -1;

	const date = moment(date1);
	moment.locale("es");
	return date.format('YYYY-MM-DD') + '\n' +
		t('That was {days} day/s {hours} hour/s {minutes} minute/s {seconds} second/s before.', {
			days: daysDifference,
			hours: hoursDifference,
			minutes: minutesDifference,
			seconds: secondsDifference
		});
}