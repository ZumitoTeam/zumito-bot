// init require
const Discord = require('discord.js');
const { t } = require('localizify');
const botConfig = require('@config/bot.js');

// export module
module.exports = {
	name: "wasted",
	description: [],
	aliases: [],
	category: "Image",
	ussage: null,
	hidden: false,
	admin: false,
	nsfw: false,
    async execute(client, message, args) {
		const user = message.mentions.members.first();
    if (!user) {
      return message.channel.send("Wasted? Who?");
    }
    const avatar = user.user.displayAvatarURL({ size: 2048, format: "png" });

    await message.channel.send({
      files: [
        {
          attachment: `https://some-random-api.ml/canvas/wasted?avatar=${avatar}`,
          name: "wasted.jpg",
        },
      ],
    });
	}
}