// init require
const Discord = require('discord.js');
const { t } = require('localizify');
const { getConfig, saveConfig, getFooter } = require("@modules/utils/data.js");
const botConfig = require('@config/bot.js');


// export module
module.exports = {
    name: "prefix",
    description: "Change/check bot prefix",
    aliases: ["setprefix"],
    ussage: 'prefix [<new prefix>]',
    examples: ['prefix', 'prefix zb-'],
    permissions: ['ADMINISTRATOR'],
    category: "Admin",
    hidden: false,
    admin: true,
    nsfw: false,
    async execute(client, message, args) {

        var settings = await getConfig(message.guild);

        if (args.length == 0) {

            return message.reply({ content: "My prefix is: " + '`' + settings.prefix + '`', allowedMentions: { repliedUser: false } });

        } else {

            settings.prefix = args[0];

            saveConfig(message.guild, settings);

            return message.reply({ content: "The prefix has been updated to: " + "`" +`${settings.prefix}` + "`", allowedMentions: { repliedUser: false } });
        }
    }
}