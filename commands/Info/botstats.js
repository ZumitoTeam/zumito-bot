// init require
const Discord = require('discord.js');
const { t } = require('localizify');
const botConfig = require('@config/bot.js');
const os = require("os");

// export module
module.exports = {
	name: "botstats",
	description: "Get information about Zumito",
	aliases: ["botinfo"],
	ussage: '',
	examples: [],
	hidden: true,
	admin: false,
	nsfw: false,

	async execute(client, message, args) {

function timeformat(timeInSeconds) {
  const days = Math.floor((timeInSeconds % 31536000) / 86400);
  const hours = Math.floor((timeInSeconds % 86400) / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.round(timeInSeconds % 60);
  return (
    (days > 0 ? `${days} days, ` : "") +
    (hours > 0 ? `${hours} hours, ` : "") +
    (minutes > 0 ? `${minutes} minutes, ` : "") +
    (seconds > 0 ? `${seconds} seconds` : "")
  );
}
		// STATS
		const guilds = client.guilds.cache.size;
		const channels = client.channels.cache.size;
		const users = client.guilds.cache.reduce((size, g) => size + g.memberCount, 0);

		// RAM
		const botUsed = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
		const botAvailable = `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
		const botUsage = `${((process.memoryUsage().heapUsed / os.totalmem()) * 100).toFixed(1)}%`;

		const overallUsed = `${((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2)} GB`;
		const overallAvailable = `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
		const overallUsage = `${Math.floor(((os.totalmem() - os.freemem()) / os.totalmem()) * 100)}%`;

		// CPU
		const platform = process.platform.replace(/win32/g, "Windows");
		const architecture = os.arch();
		const cores = os.cpus().length;
		const cpuUsage = `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)} MB`;

		const dt = new Date(message.createdTimestamp);

		var embed = new Discord.MessageEmbed()

			.setTitle(botConfig.name)
			.setThumbnail(botConfig.media.botStatusIMG)
			.setColor(botConfig.embeds.color)
			.addField("<:information:959983434187558952> "+"Info", "┕ **" + t("Guilds") + `:** \`${guilds}\`` + "\n┕ **" + t("Users") + `:** \`${users}\`` + "\n┕ **" + t("Channels") + `:** \`${channels}\``, true)
			.addField("<:ram:879830143521140776> " + t("Ram"), "┕  **" + t(" Used") + `:** \`${botUsed}\`` + "\n┕ **" + t(" Available") + `:** \`${botAvailable}\`` + "\n┕** " + t("Usage") + `:** \`${botUsage}\``, true)
			.addField("<:CPU:959987496698122270> " + "CPU", "┕ **" + "OS" + `:** \`${platform} [${architecture}]\`` + "\n┕ **" + "Usage" + `:** \`${cpuUsage}\`` + "\n┕ **" + "Cores" + `:** \`${cores}\``, true)
			//Arreglar uptime
			.addField("♦ "+"Others", "┕ **" + "Ping" + `:** \`${new Date() - dt}ms\`` + "\n┕ **" + "Node Version" + ":** `" + process.versions.node + "`" + "\n┕ **" + t("Uptime") + `:** `+ "`" +  timeformat(process.uptime()) + "`", true)
		
		message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
	}
}