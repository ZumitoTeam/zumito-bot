// init require
const Discord = require('discord.js');
const {default: localizify, t} = require('localizify');
var moment = require('moment');
const fs = require('fs');
var {image_search} = require('duckduckgo-images-api');
const axios = require('axios');
var remote = require('remote-file-size')
const { getBotVersion, getFooter, getTulipoSettings, setTulipoSettings } = require("../../utils/data.js");

// export module
module.exports = {
	name : "userinfo",
	description : "Check user info",
	aliases : ['user'],
	ussage : 'userinfo [<user mention>]',
	examples: ['userinfo', 'userinfo @Tulipo'],
	hidden : false,
	admin : false,
	nsfw : false,
	async execute(client,message,args){
	    
        let user = message.mentions.users.first() || message.author;
        let member = message.mentions.members.first() || message.member;
		
		let game;
		if (member.presence.activities[1] != undefined) {
			game = member.presence.activities[1].name;
		} else if (member.presence.activities[0] != undefined) {
			game = member.presence.activities[0].name;
		} else {
			game = t('Is not playing');
		}

		var tulipoSettings = getTulipoSettings();
		if (tulipoSettings.emojis === undefined) tulipoSettings.emojis = {};
		//var emojis = JSON.parse(fs.readFileSync('./emojis.json'));
		if (tulipoSettings.emojis[game] !== undefined) {
			game = tulipoSettings.emojis[game] + ' ' + game;
		} else {
			image_search({ query: game + ' icon', moderate: true, iterations : 3 }).then(async function (results) {
				var emojiname = game.length < 20 ? game.split(' ').join('_') : game.match(/\b(\w)/g).join('');
				//console.log(emojiname);
				var created = false;
				results.forEach(function(result) {
					if (result.width == result.height) {
						remote(result.image, function(err, o) {
							if (o < 255000 && !created) {
								//console.log(result);
								created = true;
								var added = false;
								while (!added) {
									var guild = client.guilds.cache.get(tulipoSettings.emojiGuilds[0]); // 789002039296131092
									if (guild.emojis.cache.size < 49) {
										console.log(1);
										guild.emojis.create(
											result.image,
											emojiname
										)
										.then(function(emoji) { 
											tulipoSettings.emojis[game] = emoji.toString();
											setTulipoSettings(tulipoSettings);
											console.log(2);
										})
										.catch(console.error);
										added = true;
										console.log(3);
									} else {
										tulipoSettings.emojiGuilds.shift();
									}
								}
								
								//guild.emojis
								
							}
						})
					}
				})
			});
		}

        var state = member.presence.clientStatus;
		if (state !== undefined && state != null ) {
			if (state.mobile === undefined) state.mobile = 'offline';
			if (state.desktop === undefined) state.desktop = 'offline';
			if (state.web === undefined) state.web = 'offline';
			if (state.mobile == 'online' || state.desktop == 'online' || state.web == 'online') {
				state = '<a:online:752953159416152165> ' + t('Online');
			} else if (state.mobile == 'streaming' || state.desktop == 'streaming' || state.web == 'streaming') {
				state = '<a:streaming:752953159521140837>  ' + t('In streaming');
			} else if (state.mobile == 'dnd' || state.desktop == 'dnd' || state.web == 'dnd') {
				state = '<a:dnd:752953159256768543> ' + t('Do not disturb');
			} else if (state.mobile == 'idle' || state.desktop == 'idle' || state.web == 'idle') {
				state = '<a:idle:752953159235797113> ' + t('Idle');
			} else {
				state = '<a:offline:752953159395049632>  ' + t('Offline');
			}
		} else {
			state = ':robot: Bot';
        }
        let platforms = [];
        if (member.presence.clientStatus !== undefined && member.presence.clientStatus != null) {
            Object.keys(member.presence.clientStatus).forEach(function(key) {
                if (member.presence.clientStatus[key] != 'offline') {
                    platforms.push(t(key));
                }
            });
        }
        
	
		const embed = new Discord.MessageEmbed()

		.setTitle("<:juice_face:879047636194316300>  "+t('User information')+":")
		.setThumbnail(user.avatarURL({dynamic: true}))
        .addField(t('Name')+":", user.username, true) 
        .addField(t('Discriminator')+":", '#'+user.discriminator, true);
        if (user.username != member.displayName) {
            embed.addField(t('Nickname')+":", member.displayName);
        }
        embed
		.addField(t('User ID')+":",`${user.id}`);
        if (!user.bot) {
            embed.addField(t('State')+":", state, true);
        }
        embed
        .addField(t('Playing at')+":", game, true)
		//.addField(t('¿Person or Bot?')+":", user.bot ? ":robot: "+t('Bot') : "<a:persona:754068955097989220> " + t('Person'));
        //if (!user.bot) {
            //embed.addField(t('Connected in')+":",platforms.join(' | ') || t('none'));
        //}
        embed
		.addField(t('Account creation')+":", timeDifference(new Date(user.createdTimestamp), new Date(Date.now())))
		.addField(t('Date of admission')+":", timeDifference(new Date(member.joinedTimestamp), new Date(Date.now()) ))
		.setColor("RED")
		.addField(t('Roles')+":", `${member.roles.cache.map(m => m).join(" | ")}`)
		embed.setFooter(
			//t('Requested by')+": " + message.member.user.tag + " |Tulipo V"+getBotVersion(),
			getFooter(message.member.user.tag),
		    message.member.user.displayAvatarURL({dynamic: true} )
		);

		return message.channel.send({embeds: [embed]});
	}
}

function timeDifference(date1,date2) {
	var totalDifference = difference;
    var difference = date1.getTime() - date2.getTime();

    var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    var hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    var minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    var secondsDifference = Math.floor(difference/1000);

	daysDifference = daysDifference * -1;

	const date = moment(date1);
	moment.locale("es");
	return date.format('YYYY-MM-DD') + '\n' +
		t('That was {days} day/s {hours} hour/s {minutes} minute/s {seconds} second/s before.', {
			days: daysDifference,
			hours: hoursDifference,
			minutes: minutesDifference,
			seconds: secondsDifference
		});
}