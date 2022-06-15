// init require
const Discord = require('discord.js');
const { t } = require('localizify');
const botConfig = require('@config/bot.js');

// export module
// export module
module.exports = {
	name: "afraid",
	description: [],
	aliases: [],
	category: "Image",
	ussage: null,
	hidden: false,
	admin: false,
	nsfw: false,

	async execute(client, message, args) {
        const splitArgs = args.join(" ").split("/")
        const text1 = splitArgs[0]
        if (!text1) return message.channel.send("Provide proper arguments! Note: Use '/' to split the text")
        const text2 = splitArgs[1]
        if (!text2) return message.channel.send("Provide proper arguments! Note: Use '/' to split the text")
        message.channel.send({ files: [{ attachment: `https://api.memegen.link/images/afraid/${text1}/${text2}`, name: "meme.png" }] });
    }
}