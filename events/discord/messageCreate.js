const { splitCommandLine } = require('@modules/utils/utils.js');
const { default: localizify, t } = require('localizify');         // Load localization library
const { MessageEmbed } = require('discord.js');
const botConfig = require('@config/bot.js');                    // Load bot config
const { getErrorEmbed } = require('@modules/utils/debug.js');
require("@modules/localization.js");

// Import chatbot libraries
const cleverbot = require("cleverbot-free");
const Derieri = require('derieri');
const chatbot = require("espchatbotapi");
const { generateUserWebhook } = require('@modules/webhooks');

module.exports = {
    // we want a message event
    event: "messageCreate",
    // we want it to trigger multiple times
    once: false,
    // the actual function
    async execute(message, client) {
        const channel = message.channel;
        const { getConfig } = require("@modules/utils/data.js");
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

        let prefix = settings.prefix || process.env.BOTPREFIX;

        //const args = message.content.slice(prefix.length).split(/ +/);
        if (prefix === undefined) return console.error('prefix is undefined');
        const args = splitCommandLine(message.content.slice(prefix.length));
        const command = args.shift().toLowerCase();

        // if people mention us, tell them about our prefix
        if (message.mentions.users.size) {
            if (message.mentions.users.first().id == client.user.id && message.content.startsWith('<')) {
                if (args.length == 0) {
                    return message.reply({
                        content: 'reply.prefix'.trans() + ': ' + `\`${prefix}\``, allowedMentions: { repliedUser: false }
                    });

                } else {
                    message.channel.sendTyping();
                    var text = args.join(' ');
                    try {
                        var response = await cleverbot(text);
                        message.reply(response);
                    } catch (e) {
                        console.warn('cleverbot down');
                        try {
                            var response = await deri.reply(text);
                            message.reply(response);
                        } catch (e) {
                            console.warn('Derieri down');
                            message.reply({
                                content: 'cleverbot.error'.trans(), allowedMentions: { repliedUser: false }
                            });
                            // try {
                            // 	var response = await chatbot.hablar(text);
                            // 	message.reply(response);
                            // 	message.channel.stopTyping();
                            // } catch(e) {
                            // 	console.warn('espchatbotapi down');
                            // 	message.reply(t("Sorry, my brain es exceeded, please try to talk me in a few minutes."));
                            // 	message.channel.stopTyping();
                            // }
                        }
                    }

                    /**/
                    //cleverbot(text).then(response => message.reply('<@'+message.author.id+'> ' + response));

                }
            }
        }

        // check message with prefix
        if (!message.content.startsWith(prefix)) { // if the message doesn't start with the prefix, we run non command modules

            // Check if channel is clean channel (auto delete messages after seconds)
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
                const emojiMessageDetectedEvent = require('@events/modules/free-emojis/emoji-message-detected.js');
                await emojiMessageDetectedEvent.execute(message, client, matches);
            }

            return;
        }


        // if no command like this do nothing
        var com;
        if (!client.commands.has(command)) {
            var commandList = Array.from(client.commands.keys());
            var autocorrect = require('autocorrect')({ words: commandList })
            var correctedCommand = autocorrect(command);
            if (client.commands.has(correctedCommand)) {
                com = client.commands.get(correctedCommand);
            } else {
                return;
            }
        } else {
            com = client.commands.get(command);
        }

        // check if user is not rate limited
        // if (rateLimiter.take(message.author.id)) {
        //     return message.reply(t(`You're doing that do often, please try again later!`));
        // }

        // if user message by DM
        if (message.guild == null && (com.DM === undefined || com.DM == false)) {
            // doing nothing
            return;
        }

        //  only owner
        // !message.member.roles.cache.has(localStorage.getItem('adminRole.'+message.guild.id))
        if (com.admin || com.permissions !== undefined && com.permissions.length > 0) {
            var denied = false;
            if (!message.channel.permissionsFor(message.member).has("ADMINISTRATOR") || message.member.id != message.guild.ownerId) {
                if (com.permissions !== undefined && com.permissions.length > 0) {
                    com.permissions.forEach(function (permission) {
                        if (!message.channel.permissionsFor(message.member).has(permission)) {
                            denied = true;
                        }
                    });
                }
            }
            if (denied === true) {
                return message.reply({
                    content: 'permission.error.user'.trans() + "\n" + 'permission.error.missing'.trans() + ': ' + '`permission`',
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            }
        }

        /*  TODO: Message when the bot does not have permissions for the current command
            return message.reply({
                content: 'permission.error.bot'.trans() + "\n" + 'permission.error.missing'.trans() + ': ' + "`permission`", 
                allowedMentions: {
                    repliedUser: false
                }
            });
        */


        // only on nsfw channel
        if (com.nsfw && !message.channel.nsfw && !message.channel.permissionsFor(message.member).has("ADMINISTRATOR") && message.member.id != message.guild.owner.user.id) return message.reply("require NSFW channel! so can't run command!")

        try {
            localizify.setLocale(settings.lang || 'en');
            await com.execute(client, message, args)
            if (message.channel.type != 'dm' && !message.deletable && settings.deleteCommands) {
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
            //var error = parseError(error);
            //console.error(error.name, error.message, error.stack, Object.getOwnPropertyNames(error));
            // const embed = new MessageEmbed()
            //     .setTitle("Error running command")
            //     .setColor(config.embeds.color)
            //     .setDescription("There is an error running your command. Please contact developers to solve this issue.")
            //     .setTimestamp()
            //     .addField('Command:', (comid.name || 'not defined'))
            //     .addField('Arguments:', (args.toString() || 'none'))
            //     .addField('Error:', (error.name || 'not defined'))
            //     .addField('Error message:', (error.message || 'not defined'));
            //     if (error.possibleSolutions !== undefined) {
            //         error.possibleSolutions.forEach((solution) => {
            //             embed.addField('Posible solution:', solution);
            //         });
            //     }
            //     //.addField('stack:', (error.stack ? error.stack.toString() : 'none'))

            //console.error(error);
            let content = await getErrorEmbed({
                name: error.name,
                message: error.message,
                comid: com,
                args: args,
                stack: error.stack,
            }, true);
            try {
                message.reply(content);
            } catch (e) {
                channel.send(content);
            }
        }

    }
};