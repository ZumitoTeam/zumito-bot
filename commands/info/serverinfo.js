// init require
const Discord = require('discord.js');
const botConfig = require("@config/bot.js");
const { getBotVersion, getFooter } = require("@modules/utils/data.js");
const emoji = require('@config/emojis.js');
require("@modules/localization.js");


// export module
module.exports = {
    name: "serverinfo",
    description: "Check server info",
    aliases: ['server'],
    ussage: null,
    hidden: false,
    admin: false,
    nsfw: false,
    async execute(client, message, args) {
        let user = message.mentions.users.size ? message.mentions.users.first() : message.author;

        let verifLevels = {
            'NONE': 'command.serverinfo.none'.trans(),
            'LOW': 'command.serverinfo.low'.trans(),
            'MEDIUM': 'command.serverinfo.medium'.trans(),
            'HIGH': '(╯°□°）╯︵  ┻━┻',
            'VERY_HIGH': '┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻'
        };

        let bans = await message.guild.bans.fetch();

        const embed = new Discord.MessageEmbed()
            .setTitle(emoji.boost + ' ' + 'command.serverinfo.title'.trans())
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField(emoji.info + ' ' + 'command.serverinfo.info'.trans(), '┕ **' + 'command.serverinfo.name'.trans() + ':** ' + `\`${message.guild.toString() || 'command.serverinfo.error'.trans()}\`` + '\n┕ **' + 'command.serverinfo.owner'.trans() + ':** ' + `<@${message.guild.ownerId}>` + '\n┕ **' + 'command.serverinfo.id'.trans() + ':** ' + `\`${message.guild.id || 'command.serverinfo.error'.trans()}\`` + '\n┕ **' + 'command.serverinfo.roles'.trans() + ':** ' + `\`${message.guild.roles.cache.size.toString() || 'command.serverinfo.error'.trans()}\``, true)
            .addField(emoji.cozysip + ' ' + 'command.serverinfo.members'.trans(), '┕ **' + 'command.serverinfo.online'.trans() + ':** ' + '`' + message.guild.members.cache.filter(member => member.presence.status !== 'offline').size + '`' + '\n┕ **' + 'command.serverinfo.members'.trans() + ':** ' + '`' + message.guild.members.cache.size + '`' + '\n┕ **' + 'command.serverinfo.bots'.trans() + ':** ' + '`' + message.guild.members.cache.filter(member => member.user.bot).size + '`', true)
            .addField(emoji.channel + 'command.serverinfo.channels'.trans(), '┕ **' + 'command.serverinfo.text_channels'.trans() + ':** ' + `\`${message.guild.channels.cache.filter(channel => channel.type == 'text').size}\`` + '\n┕ **' + 'command.serverinfo.voice_channels'.trans() + ':** ' + `\`${message.guild.channels.cache.filter(channel => channel.type == 'voice').size}\``, true)
            .addField('♦ ' + 'command.serverinfo.others'.trans(), '┕ **' + 'command.serverinfo.boost'.trans() + ':** ' + `\`${message.guild.premiumSubscriptionCount.toString()}\`` + '\n┕ **' + 'command.serverinfo.level'.trans() + ':** ' + `\`${message.guild.premiumTier.toString()}\`` + '\n┕ **' + 'command.serverinfo.bans'.trans() + ':** ' + `\`${bans.size}\`` + '\n┕ **' + 'command.serverinfo.verification_level'.trans() + ':** ' + `\`${verifLevels[message.guild.verificationLevel]}\``, true)
            .setColor(botConfig.embeds.color)
            .setFooter({ text: getFooter(message.member.user.tag), iconURL: message.author.avatarURL({ dynamic: true }) })

        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
function input(text) {
    let join = `\`\`\``;
    return join + text + join;
}