// init require
const Discord = require('discord.js');
const { t } = require('localizify');
const prefix = process.env.BOTPREFIX;

// export module
module.exports = {
	name: "biden",
	description: [],
	aliases: [],
	category: "Image",
	ussage: null,
	hidden: false,
	admin: false,
	nsfw: false,
    async execute(client, message, args) {
		if (!args[0]) {
			return message.channel.send(`Usage: ${prefix}biden <msg>`)
		  }
		  let bidenMessage = args.slice(0).join(' ');
		  if (bidenMessage.length > 65) return message.channel.send('**You Are Not Allowed To Go Over 65 Characters!**');
	  
		  message.channel.send({ files: [{ attachment: `https://api.popcatdev.repl.co/biden?text=${bidenMessage}`, name: 'reaperbiden.jpg' }] });

    }
}