// init require
const Discord = require('discord.js');
const { t } = require('localizify');
const botConfig = require('@config/bot.js');

// export module
module.exports = {
	name: "wideavatar",
	description: [],
	aliases: [],
	category: "Image",
	ussage: null,
	hidden: false,
	admin: false,
	nsfw: false,
    async execute(client, message, args) {
        const mention = message.mentions.members.first() || message.member;
        const avatar = mention.user.displayAvatarURL({
          dynamic: true,
          size: 2048,
          format: "png",
        });
    
        message.channel.send({
          files: [
            {
              attachment: `https://vacefron.nl/api/wide?image=${avatar}`,
              name: "wideavatar.png",
            },
          ],
        });

    }
}