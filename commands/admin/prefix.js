// init require
const Discord = require('discord.js');
const botConfig = require("@config/bot.js");
const { getConfig, saveConfig, getFooter } = require("@modules/utils/data.js");
const emojis = require('@config/emojis.js');
require("@modules/localization.js");

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

        if (!args.has(0)) {

            var embed = new Discord.EmbedBuilder()
                .setDescription(emojis.cozysip + ' ' + 'command.prefix.description.0'.trans() + ' `' + settings.prefix + '`')
                .setColor(botConfig.embeds.color)

            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

        } else {

            settings.prefix = args.get(0).value;
            settings.save();

            var embed = new Discord.EmbedBuilder()
                .setDescription(emojis.check + ' ' + 'command.prefix.description.1'.trans() + " `" + `${settings.prefix}` + "`")
                .setColor(botConfig.embeds.color)

            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

        }
    }
}