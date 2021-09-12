// init require
const { Discord, MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const {default: localizify, t} = require('localizify');
const config = require('../../config.js');

// export module
module.exports = {
	name : "avatar",
	description : "Get user avatar image",
	aliases : [],
	ussage : '',
	examples:[], 
	hidden : true,
	admin : false,
    nsfw : false,

    async execute(client, message, args){

		let avatar;
		if(message.mentions.users.size > 0){
            avatar = message.mentions.users.first().displayAvatarURL({ dynamic: true, size:1024 });
        } else {
            avatar = message.author.displayAvatarURL({ dynamic: true, size:1024 });
		}
		let user;
		if(message.mentions.users.size > 0){
            user = message.mentions.users.first().username;
        } else {
            user = message.author.username;
		}

		var embed = new MessageEmbed()
		.setColor(config.embeds.color)
		.setAuthor('Avatar of' + ' ' + user, avatar)
		.setImage(avatar)

		const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
			.setLabel('Avatar URL')
			.setStyle('LINK')
			.setURL(avatar)
			.setEmoji('879047987177852978')
		);
		await message.reply({components: [row], embeds: [embed], allowedMentions: { repliedUser: false } });

 	}
}