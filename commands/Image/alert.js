// init require
const Discord = require('discord.js');
const { t } = require('localizify');
const botConfig = require('@config/bot.js');
const prefix = process.env.BOTPREFIX;

// export module
// export module
module.exports = {
	name: "alert",
	description: [],
	aliases: [],
	category: "Image",
	ussage: null,
	hidden: false,
	admin: false,
	nsfw: false,

	async execute(client, message, args) {
        if (!args[0]) {
            return message.channel.send(`Usage: ${prefix}clyde <msg>`)
          }
          let alertMessage = args.slice(0).join(' ');
          if (alertMessage.length > 65) return message.channel.send('**You Are Not Allowed To Go Over 65 Characters!**');
      
          message.channel.send({ files: [{ attachment: `https://api.popcatdev.repl.co/alert?text=${alertMessage}`, name: 'reaperalert.jpg' }] });
    }
}