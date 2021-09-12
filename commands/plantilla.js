// init require
const Discord = require('discord.js');
const {default: localizify, t} = require('localizify');

// export module
module.exports = {
	name : "", // comando sin el prefix
	description : "", // descripcion del comando (En ingles)
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
		// codigo de tu comando
		
	}
}