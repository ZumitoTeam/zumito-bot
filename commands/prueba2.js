// init require
const { Discord, MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const {default: localizify, t} = require('localizify');

// export module
module.exports = {
	name : "prueba2", // comando sin el prefix
	description : "prueba", // descripcion del comando (En ingles)
	aliases : ["pr2"], // alias del comando en "" separados por , sin el prefix
	ussage : '',
	examples:[], 
	hidden : true,
	admin : false,
    nsfw : false,

    async execute(client, message, args){

		var embed = new MessageEmbed()
		.setColor('RED')
		.setTitle('Some title')
		.setDescription('Some description here')

		const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('primary')
				.setLabel('Primary')
				.setStyle('PRIMARY'),
		);
	  
		message.channel.send({ components: [row], embeds: [embed] });

 	} 
}