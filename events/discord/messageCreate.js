const {splitCommandLine} = require('../../utils/utils.js');
const {default: localizify, t} = require('localizify');         // Load localization library
const {MessageEmbed} = require('discord.js');
const config = require('../../config.js');      // Load bot config

module.exports = {
    // we want a message event
    event: "messageCreate",
    // we want it to trigger multiple times
    once: false,
    // the actual function
    async execute(message, client) {
        const { getConfig } = require("../../utils/data.js");
        var settings = {};
        if (message.guild != null) {
            settings = await getConfig(message.guild);
            if (settings.mutedUsers[message.author.id.toString()] != undefined && settings.mutedUsers[message.author.id.toString()].muted == true) {
                client.users.cache.get(message.author.id).send(t('you can\'t chat on {servername} because you\'re muted', {
                    servername: message.guild.name,
                }));
                message.delete();
                return;
            }


            // if (isDiscordInvitation(message.content)) {
            //     if (settings.filterInvites.enabled) {
            //         if (settings.filterInvites.warn) {
            //             warn(client, message, message.author, t('Send discord server invite link'));
            //         }
            //         if (settings.filterInvites.delete) {
            //             message.delete();
            //             return;
            //         }
            //     }
            // }
        }

        let prefix = settings.prefix || process.env.Prefix;

        //const args = message.content.slice(prefix.length).split(/ +/);
        if (prefix === undefined) return console.error('prefix is undefined');
        const args = splitCommandLine(message.content.slice(prefix.length));
        const command = args.shift().toLowerCase();

        // if people mention us, tell them about our prefix
        if (message.mentions.users.size) {
            if (message.mentions.users.first().id == client.user.id && message.content.startsWith('<')) {
                if (args.length == 0) {
                    return message.lineReply(`my prefix is \`${prefix}\``);
                    //return message.reply(`my prefix is \`\`${prefix}\`\``)
                } else {
                    message.channel.startTyping();
                    var text = args.join(' ');
                    try {
                        var response = await cleverbot(text);
                        message.lineReply(response);
                        message.channel.stopTyping();
                    } catch (e) {
                        console.warn('cleverbot down');
                        try {
                            var response = await deri.reply(text);
                            message.lineReply(response);
                            message.channel.stopTyping();
                        } catch (e) {
                            console.warn('Derieri down');
                            message.lineReply(t("Sorry, my brain es exceeded, please try to talk me in a few minutes."));
                            message.channel.stopTyping();
                            // try {
                            // 	var response = await chatbot.hablar(text);
                            // 	message.lineReply(response);
                            // 	message.channel.stopTyping();
                            // } catch(e) {
                            // 	console.warn('espchatbotapi down');
                            // 	message.lineReply(t("Sorry, my brain es exceeded, please try to talk me in a few minutes."));
                            // 	message.channel.stopTyping();
                            // }
                        }
                    }

                    /**/
                    //cleverbot(text).then(response => message.channel.send('<@'+message.author.id+'> ' + response));

                }
            }
        }

        // check message with prefix
        if (!message.content.startsWith(prefix)) { //|| message.author.bot
            // Check if channel is clean (auto delete messages after seconds)
            if (settings.cleanChannels === undefined) {
                settings.cleanChannels = {};
            }
            if (settings.cleanChannels[message.channel.id] !== undefined) {
                setTimeout(function () {
                    if (!message.pinned || (message.pinned && !settings.cleanChannels[message.channel.id].keepPinned)) {
                        message.delete();
                    }

                }.bind(message), settings.cleanChannels[message.channel.id].time * 1000);
            }

            var matches = message.content.match(/:([^:\s]+)\:(?![^<>]*>)/g);
            if (!message.author.bot && matches) {
                var text = message.content;
                matches.forEach(function (match) {
                    var emojiName = match.split(':').join("");
                    var emoji = client.emojis.cache.find(emoji => emoji.name === emojiName);
                    if (emoji === undefined) return;
                    text = text.replace(match, "<" + (emoji.animated ? 'a' : '') + ":" + emoji.name + ":" + emoji.id + ">");
                });
                if (text == message.content) return;
                let webhook = await message.channel.createWebhook(message.author.username, {
                    avatar: message.author.displayAvatarURL(),
                });
                //if (webhook === undefined || webhook === null) return console.log('webhook');
                if (message.reference !== undefined && webhook.reference != null) {
                    console.log('reply');
                    let reference = await message.channel.messages.fetch(message.reference.messageID);
                    text = {
                        content: text,
                        embed: {
                            "author": {
                                "name": reference.author.username,
                                "url": reference.author.displayAvatarURL(),
                                "icon_url": reference.url
                            },
                            "description": reference.content
                        }
                    }
                }
                await webhook.send(text);
                webhook.delete();
                //message.channel.send("test: " + text);
                if (!message.deleted) message.delete();
            }

            //if (message.guild != null) Messages.appendMessage(message.author.id, message.guild.id, 1);

            return;
        }


        // if no command like this do nothing
        if (!client.commands.has(command)) return;
        var comid = client.commands.get(command);

        // check if user is not rate limited
        // if (rateLimiter.take(message.author.id)) {
        //     return message.channel.send(t(`You're doing that do often, please try again later!`));
        // }

        // if user message by DM
        if (message.guild == null && (comid.DM === undefined || comid.DM == false)) {
            // doing nothing
            return;
        }

        //  only owner
        // !message.member.roles.cache.has(localStorage.getItem('adminRole.'+message.guild.id))
        if (comid.admin || comid.permissions !== undefined && comid.permissions.length > 0) {
            var denied = false;
            if (!message.channel.permissionsFor(message.member).has("ADMINISTRATOR") || message.member.id != message.guild.ownerId) {
                if (comid.permissions !== undefined && comid.permissions.length > 0) {
                    comid.permissions.forEach(function (permission) {
                        if (!message.channel.permissionsFor(message.member).has(permission)) {
                            denied = true;
                        }
                    });
                }
            }
            if (denied === true) {
                return message.channel.send("<:tulipo_cross:816448247459348480> <@637827404441845771> " + t('You do not have sufficient permissions to use this command.'));
            }
        }

        // only on nsfw channel
        if (comid.nsfw && !message.channel.nsfw && !message.channel.permissionsFor(message.member).has("ADMINISTRATOR") && message.member.id != message.guild.owner.user.id) return message.reply("require NSFW channel! so can't run command!")

        try {
            localizify.setLocale(settings.lang || 'en');
            await comid.execute(client, message, args);
            if (message.channel.type != 'dm' && !message.deleted && settings.deleteCommands) {
                try {
                    message.delete().catch(function () {
                        console.error('can\'t delete user command');
                    });
                    const metadata = fetch('https://tulipo.ga/api/last_command/' + command).json()

                } catch (err) {
                    console.error(error.name, error.message);
                }

            }
        } catch (error) {
            console.error(error.name, error.message, error.stack, Object.getOwnPropertyNames(error));
            const embed = new MessageEmbed()
                .setTitle("Error running command")
                .setColor(config.embeds.color)
                .setDescription("There is an error running your command. Please contact developers to solve this issue.")
                .setTimestamp()
                .addField('Command:', (comid.name || 'not defined'))
                .addField('Arguments:', (args.toString() || 'none'))
                .addField('Error:', (error.name || 'not defined'))
                .addField('Error message:', (error.message || 'not defined'))
                //.addField('stack:', (error.stack ? error.stack.toString() : 'none'))

            message.reply({embeds: [embed]});
            //message.reply('there was an error trying to execute that command!');
        }

    }
};