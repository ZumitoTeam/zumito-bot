// init require
const { Discord, MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const {default: localizify, t} = require('localizify');


// export module
module.exports = {
	name : "junn", // comando sin el prefix
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

		var embed = new MessageEmbed()
		.setColor('RED')
		.setAuthor('YAMETE','https://3.bp.blogspot.com/-dkBo72TMQi8/WmUHgTzIrsI/AAAAAAAADC0/93JbfCXOKNsawa7ISDSXbiZcFDGjMg9DQCLcBGAs/w1200-h630-p-k-no-nu/ichigo-chocola-flavor-02.jpg' , 'https://discord-buttons.js.org/')
		.setTitle('YA BASTA FREEZER')
		.setURL('https://htmlcolorcodes.com/es/')
		.setThumbnail('https://dthezntil550i.cloudfront.net/cv/latest/cv1906140136413140006498873/1280_960/77201225-8685-4a84-8217-19caff63eaad.png')
		.setDescription('[KAKAROTOOOOO](https://i.ytimg.com/vi/HmOqlyWi9uo/maxresdefault.jpg)'+'\nYO ANTES ERA COMO TU') 
		.addField("YA VALISTE","VERGA CABRON")
		.setImage('https://i.pinimg.com/474x/56/68/ec/5668ec5f49399b25e9acbbbb28068750.jpg')
		.setTimestamp()
		.setFooter('NATURE ES JOTO', 'https://cdn.memegenerator.es/imagenes/memes/thumb/30/84/30842509.jpg')

		const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('primary')
				.setLabel('DRAGON JOTO Z')
				.setEmoji('879832876907118662')
				.setStyle('PRIMARY'),
		
			new MessageButton()
				.setCustomId('primary')
				.setLabel('DRAGON JOTO Z')
				.setEmoji('879832876907118662')
				.setStyle('PRIMARY'),
		);
	  
		message.channel.send({ components: [row], embeds: [embed] });

 	} 
		}