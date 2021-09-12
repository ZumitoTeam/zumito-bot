// init require
const { Discord, MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const {default: localizify, t} = require('localizify');
const config = require('../../config.js');

// export module
module.exports = {
	name : "botinfo",
	description : "Get information about Zumito",
	aliases : [], 
	ussage : '',
	examples:[], 
	hidden : true,
	admin : false,
    nsfw : false,

    async execute(client, message, args){
		// codigo de tu comando
		const dt = new Date(message.createdTimestamp);

		var embed = new MessageEmbed()
		.setColor(config.embeds.color)
		.setTitle('Zumito')
		.setDescription("Credits to `fernandomema#4512`\ `William Acosta#6863` ")
		.setThumbnail("https://media.discordapp.net/attachments/879845851416121365/879846987317510255/zumito-cool.png?width=459&height=572")
		.addField("Ping", "┕ "+ "`" + `\`${new Date() - dt}ms\``+ "`" + "ms",true)
		.addField("<:clock:879832876907118662> Uptime", `┕  \`${new Date() - dt}ms\``,true)
		.addField("<:ram:879830143521140776> Memory", `┕  \`${new Date() - dt}ms\``,true)
		.addField("Servers", `2`,true)
		.addField("Users", `┕  \`${new Date() - dt}ms\``,true)
		.addField("Shard", `┕  \`${new Date() - dt}ms\``,true)
		.addField("Commands", `┕  \`${new Date() - dt}ms\``,true)
		.addField("Tracked", `┕  \`${new Date() - dt}ms\``,true)
		.addField("Verified", `┕  \`${new Date() - dt}ms\``,true)

		message.reply({embeds: [embed] });
	}
}