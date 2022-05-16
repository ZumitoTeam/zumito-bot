const Discord = require('discord.js');
const botConfig = require("@config/bot.js");

module.exports = {
	name : "ping",
	description : "check transmit and server runtime!",
	aliases : ["p","test"],
	ussage : null,
	hidden : false,
	admin : true,
	nsfw : false,
	execute(client,message,args){
		const dt = new Date(message.createdTimestamp);

		const embed = new Discord.MessageEmbed()

		.setDescription('🏓' + ' ' + `Pong \`\`${new Date() - dt}ms\`\` | ws : \`\`${client.ws.ping}ms\`\``)
		.setColor(botConfig.embeds.color)

		return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
	}
}