// init require
const Discord = require('discord.js');
const {t} = require('localizify');
const { getFooter } = require("@modules/utils/data.js");

// export module
module.exports = {
	name : "commandlist",
	description : "List bot available commands",
	aliases : ["commands"],
	ussage : '',
	examples: [''],
	hidden : true,
	admin : true,
	nsfw : false,
	async execute(client,message,args){
		message.reply([...new Set(client.commands.map(command => command.name))].join(', '));
	}
}