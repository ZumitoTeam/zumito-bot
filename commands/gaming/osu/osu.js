// init require
const { Discord, MessageActionRow, MessageEmbed, MessageButton, MessageSelectMenu } = require('discord.js');
const {default: localizify, t} = require('localizify');
const config = require('../../../config.js');

// export module
module.exports = {
	name : "osu", 
	description : "",
	aliases : [], // alias del comando en "" separados por , sin el prefix
	ussage : '',
	examples:[], 
	permissions: [],
	botPermissions: [],
	hidden : false,
	admin : false,
	nsfw : false,
	cooldown: 0,

    async execute(client, message, args){

        var embed = new MessageEmbed()
        .setColor(config.embeds.color)
        .setAuthor('Osu!',"https://media.discordapp.net/attachments/879845851416121365/884458336160972930/Osu.png")
		.setTitle("[object Object]")

		const row = new MessageActionRow()
                  .addComponents(
                      new MessageSelectMenu()
                      .setCustomId('select')
                      .setPlaceholder('Select category')
                      .addOptions([
                        {
                            label: '1',
                            description: '1',
                            value: 'first_option',
                        },
                        {
                            label: 'You can select me too',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                    ])
                  )
        
				  message.reply({ components: [row], embeds: [embed], allowedMentions: { repliedUser: false } });
		
	}
}