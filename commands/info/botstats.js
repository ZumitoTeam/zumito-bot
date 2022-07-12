const Discord = require('discord.js');
const botConfig = require('@config/bot.js');
const os = require("os");
const emojis = require('@config/emojis.js');
const { getFooter } = require("@modules/utils/data.js");
require("@modules/localization.js");

module.exports = {
	name: "botstats",
	aliases: ["botinfo"],
	examples: [],
	hidden: false,
	admin: false,
	nsfw: false,
	cooldown: 0,
	slashCommand: true,
	dm: true,

	async execute(client, message, args) {

		const guilds = client.guilds.cache.size;
		const channels = client.channels.cache.size;
		const users = client.guilds.cache.reduce((size, g) => size + g.memberCount, 0);

		const botUsed = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
		const botAvailable = `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
		const botUsage = `${((process.memoryUsage().heapUsed / os.totalmem()) * 100).toFixed(1)}%`;

		const platform = process.platform.replace(/win32/g, "Windows");
		const architecture = os.arch();
		const cores = os.cpus().length;
		const cpuUsage = `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)} MB`;

		const dt = new Date(message.createdTimestamp);

		var embed = new Discord.MessageEmbed()

			.setTitle(botConfig.name)
			.setURL(botConfig.URL)
			.setThumbnail(botConfig.media.botStatusIMG)
			.setColor(botConfig.embeds.color)
			.addField(emojis.info + ' ' + 'command.botstats.info'.trans(), "┕ **" + 'command.botstats.guilds'.trans() + `:** \`${guilds}\`` + "\n┕ **" + 'command.botstats.users'.trans() + `:** \`${users}\`` + "\n┕ **" + 'command.botstats.channels'.trans() + `:** \`${channels}\``, true)
			.addField(emojis.ram + ' ' + 'command.botstats.ram'.trans(), "┕  **" + 'command.botstats.used'.trans() + `:** \`${botUsed}\`` + "\n┕ **" + 'command.botstats.available'.trans() + `:** \`${botAvailable}\`` + "\n┕** " + 'command.botstats.usage'.trans() + `:** \`${botUsage}\``, true)
			.addField(emojis.cpu + ' ' + 'command.botstats.cpu'.trans(), "┕ **" + 'command.botstats.os'.trans() + `:** \`${platform} [${architecture}]\`` + "\n┕ **" + 'command.botstats.usage'.trans() + `:** \`${cpuUsage}\`` + "\n┕ **" + 'command.botstats.cores'.trans() + `:** \`${cores}\``, true)
			.addField('♦ ' + 'command.botstats.others'.trans(), "┕ **" + 'command.botstats.ping'.trans() + `:** \`${new Date() - dt}ms\`` + "\n┕ **" + 'command.botstats.node_version'.trans() + ":** `" + process.versions.node + "`" + "\n┕ **" + 'command.botstats.uptime'.trans() + `:** ` + "`" + timeformat(process.uptime()) + "`", true)
			.setFooter({ text: getFooter((message.author || message.member.user).tag), iconURL: (message.author || message.user).avatarURL({ dynamic: true }) })

		message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
	}

}

function timeformat(timeInSeconds) {

	const days = Math.floor((timeInSeconds % 31536000) / 86400);
	const hours = Math.floor((timeInSeconds % 86400) / 3600);
	const minutes = Math.floor((timeInSeconds % 3600) / 60);
	const seconds = Math.round(timeInSeconds % 60);

	return (

		(days > 0 ? `${days}` + ' ' + 'timeformat.days'.trans() + ', ' : "") +
		(hours > 0 ? `${hours}` + ' ' + 'timeformat.hours'.trans() + ', ' : "") +
		(minutes > 0 ? `${minutes}` + ' ' + 'timeformat.minutes'.trans() + ', ' : "") +
		(seconds > 0 ? `${seconds}` + ' ' + 'timeformat.seconds'.trans() : "")
	);
}