// init require
const Discord = require('discord.js');
const fs = require("fs");
var read = require('fs-readdir-recursive')
const commandFiles = read('./commands');//fs.readdirSync('./commands');//.filter(file => file.endsWith('.js'));
const owner = process.env.OWNER;
const prefix = process.env.BOTPREFIX;
const { t } = require('localizify');
const { sendTimedMessage } = require("../../utils/messages.js");
const { tn } = require('../../utils/utils.js');

// export module
module.exports = {
	name: "help",
	description: "tulipo help command",
	aliases: ["?", "h"],
	ussage: "help [<command>]",
	examples: ['help', 'help userinfo'],
	hidden: false,
	admin: false,
    nsfw: false,
    DM: true,
	async execute(client, message, args) {
		const own = client.users.resolve(owner);
		var desc = t('tulipo.description');//description.replace(/{{owner}}/g, `\`\`${own.tag}\`\``);
		let user = message.mentions.users.size ? message.mentions.users.first() : message.author;
		var util = client.util;
		const embed = new Discord.MessageEmbed();

		if (!args[0]) {
			// var folder = '';
			// var cm = commandFiles.map((e, i) => {
			// 	if (fs.existsSync(`../commands/${e}`) || fs.existsSync(`../commands/${folder}/${e}`)) {
					
			// 	}
			// 	const cmd = require(`../../commands/${e}`)
			// 	if (!cmd.hidden) {
			// 		return `#${util.tn(util.addZero(i + 1, 2), 1)} | ${util.tn(cmd.name, 2)} | ${util.tn(cmd.aliases.join(", "), 4)}`
			// 	}
			// 	return null;
			// });

			// var batas = "+--------+------------+----------------------+",
			// 	header = `\`\`\`\n#${util.tn("No", 1)} | ${util.tn("commands", 2)} | ${util.tn("aliases", 4)}\n\`\`\``,
			// 	footer = `ℹ️ `+ t('use {command} for more info!', {command: `\`\`${prefix}help [command]\`\``})+`* <:Tulipo:753281123655614635>\n\n**Link:**\n${util.usefulLnk(client).join("\n")}`;

			// embed
			// 	.setColor("RED")
			// 	.setAuthor(`${client.user.username} | ` + t('Help & About'), client.user.avatarURL())
			// 	.setDescription(
			// 		(`${desc}\n\n**` + t('List of command') + `:**\n${header}\`\`\`css\n${cm.filter(e => { return e !== null }).join("\n")}\`\`\`\n${footer}`).substring(0, 2047)
			// 	)
			// 	.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/8/88/Radar2.gif");
			// embed.setFooter(
			// 	t('Requested by') + ": " + user.tag + " |Tulipo V1.0",
			// 	user.avatarURL({ dynamic: true })
            // );
            // if (message.channel.type != 'dm') {
            //     message.reply(t('Help sended to DM')).then(async function(sendedMessage) {
            //         emoji = ['9️⃣','8️⃣','7️⃣','6️⃣','5️⃣','4️⃣','3️⃣','2️⃣','1️⃣','0️⃣']
            //         for (var i = 4; i < 10; i++) {
            //             await sendedMessage.react(emoji[i]);
            //             await sleep(1000);
            //             await sendedMessage.reactions.removeAll();
            //         }
            //         sendedMessage.delete();
            //     });
            // }
            
			// return message.author.send(embed);
			sendTimedMessage(message.channel, t('Help sended to DM'), 7);
			return message.author.send({
				"embeds": [{
					"title": "",
					"color": 16711680,
					"description": "",
					"timestamp": "",
					"url": "https://tulipo.ga/",
					"author": {
					  "name": "Tulipo",
					  "url": "",
					  "icon_url": "https://cdn.discordapp.com/attachments/813104993091190814/813819667255787570/tulipo_happy.png"
					},
					"image": {
					  "url": ""
					},
					"thumbnail": {
					  "url": ""
					},
					"footer": {
					  "text": "",
					  "icon_url": ""
					},
					"fields": [
					  {
						"name": "<:textchannel:761996014453391360> Comandos:",
						"value": t("You can check my list of commands here:") + ": \nhttps://tulipo.ga/commands"
					  },
					  {
						"name": "<:tulipo_happy:813820074359521320> Prefix:",
						"value": t("Default prefix: {prefix} or you can mention me to know it.", { prefix: '`tl-`' }) + "\n"+t("To execute commands, first type the prefix and then the command, e.g.") + " : `tl-`help."
					  },
					  {
						"name": "<:information:761985109934866432> " + t("Details of a command:"),
						"value": t("Use {prefix} <command> for more information.", {prefix: '`tl-help`'}) + "\n" + t("Example") + ": `tl-help userinfo`"
					  },
					  {
						"name": "<:link:813908735856345098> " + t("Useful links:"),
						"value": t("List of commands:") + " https://tulipo.ga/commands\nInvite: http://tulipo.ga/invite\n" + t("Website:") + " https://tulipo.ga/\n" + t("Support server:") + " https://discord.gg/Wrabb6R75w\nPremium :"
					  }
					]
				  }]
			  });

		} else {
			var comid = client.commands.get(args[0]);
            if (!comid) return message.author.send(`<tulipo_cross:816448247459348480>There is no command line: **'${args[0]}'**`)
            var ussage = comid.ussage == null ? "" : `**🔺${tn("Ussage", 3)} :**\n\`\`\` ${prefix + comid.name} ${comid.ussage}\`\`\``;
            embed
                .setColor(16711680)
                //.setTitle(`**${comid.name}**`)
                .setAuthor({
					name: `${client.user.username} | Help Command`,
				})
				.setDescription(
                    `**🔺${tn("Command", 3)}:**\n\`\`\` ${comid.name}\`\`\`\n` +
                    `**🔺${tn("Description", 3)}:**\n\`\`\`${t(comid.description)}\`\`\`\n` +
                    (comid.aliases.length > 0 ? `**🔺${tn("Aliase(s)", 3)}:**\n\`\`\` ${comid.aliases.join(", ")}\`\`\`\n`: '') +
					`${ussage}` + `\n🔺**More info:**\n__**[Click here](https://tulipo.ga/commands#${comid.name})**__`
                )
                .setThumbnail("https://media.discordapp.net/attachments/755547764917534751/828672488832499712/tulipo_info.png")

            if (message.channel.type != 'dm') {
                
                /*message.reply(t('Help sended to DM')).then(async function(sendedMessage) {
                    emoji = ['9️⃣','8️⃣','7️⃣','6️⃣','5️⃣','4️⃣','3️⃣','2️⃣','1️⃣','0️⃣']
                    for (var i = 4; i < 10; i++) {
                        await sendedMessage.react(emoji[i]);
                        await sleep(1000);
                        await sendedMessage.reactions.removeAll();
                    }
                    sendedMessage.delete();
                });*/
                sendTimedMessage(message.channel, t('Help sended to DM'), 7);
            }

            return message.author.send({embeds: [embed]});
        }

    }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function traverseDir(dir) {
	fs.readdirSync(dir).forEach(file => {
		let fullPath = path.join(dir, file);
		if (fs.lstatSync(fullPath).isDirectory()) {
			//console.log(fullPath);
			traverseDir(fullPath);
		} else {
			//console.log(fullPath);
			const command = require(`./${fullPath}`);

			// set a new item in the Collection
			// with the key as the command name and the value as the exported module
			client.commands.set(command.name, command);
			console.log(`Loading: ${file} as ${command.name}`)
			// set if there aliase !== null
			// // with the key as the each of command aliases and the value as the exported module
            console.log(command.aliases);
			command.aliases.map(e => {
				// console.log(e);
				client.commands.set(e, command);
				console.log(`Loading: ${file} as ${e}`)
			})
		}
	});
}