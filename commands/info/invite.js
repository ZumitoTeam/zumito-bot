// init require
const { Discord, MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const { getFooter } = require("../../utils/data.js");
const {default: localizify, t} = require('localizify');
const config = require('../../config.js');

// export module
module.exports = {
	name : "invite",
	description : "Get tulipo invite urls",
	aliases : [],
	ussage : '',
	examples:[], 
	hidden : true,
	admin : false,
    nsfw : false,

    async execute(client, message, args){


		var embed = new MessageEmbed()
		.setColor(config.embeds.color)
		.setAuthor('Invitation', 'https://media.discordapp.net/attachments/752920872318271504/879505103067967518/zumito.png')
		.setDescription('Here is the invitation link for you to invite me to your server. <:juice_face:879047636194316300>')
		.setImage('https://media.discordapp.net/attachments/752920872318271504/879505391900295168/zumito_banner.png?width=1144&height=572')

		const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
			.setLabel('Invite')
			.setStyle('LINK')
			.setURL('https://zumito.ga/invite')
			.setEmoji('879047987177852978'),

			new MessageButton()
			.setLabel('Support')
			.setStyle('LINK')
			.setURL('https://zumito.ga/server')
			.setEmoji('879509411285045279'),

			new MessageButton()
			.setLabel('Website')
			.setStyle('LINK')
			.setURL('https://zumito.ga/')
			.setEmoji('879510323676200980')
			);

		await message.channel.send({ components: [row], embeds: [embed] });

	 } 

}