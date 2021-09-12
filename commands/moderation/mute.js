// init require
const { Discord, MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const {default: localizify, t} = require('localizify');
const config = require('../../config.js');
const { getConfig } = require("../../utils/data.js");

// export module
module.exports = {
	name : "mute",
	description : "", 
	aliases : [],
	ussage : '',
	examples:[], 
	permissions: [],
	botPermissions: [],
	hidden : false,
	admin : false,
	nsfw : false,
	cooldown: 0,

    async execute(client, message, args){
	
		var settings = await getConfig(message.guild);
        var embed = new MessageEmbed()
        .setColor(config.embeds.color)
        .setTitle('<a:muted:881994642684526623> Usuario silenciado')
        .setThumbnail('https://images-ext-2.discordapp.net/external/CWLy1vEpd75qgLvvU2qd8PIIMzzJ0PYt2AxyxcA4ZVw/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/637827404441845771/c354b8b33eb253bea7fb902984048f7f.webp?width=676&height=676')
        .addField('Nombre:','William Acosta#6765',true)
        .addField('ID:', '5456446498774', true)
        .addField('Motivo: ', 'Sin motivo')
        .addField('Moderador:', 'Fernandomema#5544',true)
        .addField('ID:', '43434234523', true)
        .addField('Tiempo:', 'Sin especiicar')
    message.channel.send({ embeds: [embed] });

	}

    }


	/*Msg cuando ejecute el comando sin mencion

        var embed = new MessageEmbed()
        .setColor(config.embeds.color)
        .setDescription('Invalid command, try to use as: \n' + t('`{command} [member] (optional reason) (optional time)`' , {command: settings.prefix + 'mute'}) + '\n\nArguments: \n`member:` User mention (@Usuario) \n`reason:` Text (may include spaces) \n`time:` day `d`, hour `h`, minutes `m`, seconds `s`')
    message.channel.send({ embeds: [embed] });*/

	/*//msg usuario silenciado
	
       var embed = new MessageEmbed()
        .setColor(config.embeds.color)
        .setAuthor('William Acosta#6863 has been muted.', 'https://images-ext-2.discordapp.net/external/CWLy1vEpd75qgLvvU2qd8PIIMzzJ0PYt2AxyxcA4ZVw/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/637827404441845771/c354b8b33eb253bea7fb902984048f7f.webp?width=467&height=467')
    message.channel.send({ embeds: [embed] });
*/

/*//msg cuando intenta silenciar a un moderador o adminitrador

       var embed = new MessageEmbed()
        .setColor(config.embeds.color)
        .setDescription('You can't mute a moderator or administrator .')
    message.channel.send({ embeds: [embed] });*/

/*//Cuando no encuentra a un usiaro 

       var embed = new MessageEmbed()
        .setColor(config.embeds.color)
        .setDescription('Member not found')
    message.channel.send({ embeds: [embed] });*/

/*//msg cuando el rol esta por debajo al que va a silenciar

       var embed = new MessageEmbed()
        .setColor(config.embeds.color)
        .setDescription("I can't do that because my **highest role** is **too low** in the hierarchy.")
		.addField("Need help?", 'https://zumito.ga/wiki/')

		message.channel.send({ embeds: [embed] });*/

/*//msg md al usuario muteado

        var embed = new MessageEmbed()
        .setColor(config.embeds.color)
        .setTitle('<a:muted:881994642684526623> You have been mute')
        .setThumbnail('https://images-ext-2.discordapp.net/external/CWLy1vEpd75qgLvvU2qd8PIIMzzJ0PYt2AxyxcA4ZVw/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/637827404441845771/c354b8b33eb253bea7fb902984048f7f.webp?width=676&height=676') 
        .addField('Server: ', 'Otakus')
        .addField('Reason: ', 'Unspecified')
        .addField('Moderator:', 'WilliamAcosta#6865')
        .addField('Time: ', 'Unspecified')
    message.channel.send({ embeds: [embed] });*/