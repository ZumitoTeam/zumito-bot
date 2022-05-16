const Discord = require('discord.js');
const botConfig = require("@config/bot.js");
const { getBotVersion, getFooter } = require("@modules/utils/data.js");
const emoji = require('@config/emojis.js');
require("@modules/localization.js");

module.exports = {
    name: "serverinfo",
    description: "Check server info",
    aliases: ['server'],
    ussage: null,
    hidden: false,
    admin: false,
    nsfw: false,
    async execute(client, message, args) {

        function timeZoneConvert(data) {
            var months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let date1 = new Date(data);
            let date = date1.getDate();
            let year = date1.getFullYear();
            let month = months[date1.getMonth() + 1];
            let h = date1.getHours();
            let m = date1.getMinutes();
            let ampm = 'AM';
            if (m < 10) {
                m = '0' + m;
            }
            if (h > 12) {
                h = h - 12;
                let ampm = 'PM';
            }
            return month + ' ' + date + ', ' + year + ' ' + h + ':' + m + ' ' + ampm;
        }


        let user = message.mentions.users.size ? message.mentions.users.first() : message.author;

        let verifLevels = {
            'NONE': 'command.serverinfo.none'.trans(),
            'LOW': 'command.serverinfo.low'.trans(),
            'MEDIUM': 'command.serverinfo.medium'.trans(),
            'HIGH': '(╯°□°）╯︵  ┻━┻',
            'VERY_HIGH': '┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻'
        };


        let bans = await message.guild.bans.fetch();

        const owner = await client.users.fetch(message.guild.ownerId);

        const embed = new Discord.MessageEmbed()

            .setTitle(emoji.boost + ' ' + `${message.guild.toString() || 'command.serverinfo.error'.trans()}`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setDescription(`\**${message.guild.description || 'command.serverinfo.error.description'.trans()}\**` + '\n\n' + 'command.serverinfo.id'.trans() + ': ' + `\**${message.guild.id || 'command.serverinfo.error'.trans()}\**` + '\n' + 'command.serverinfo.owner'.trans() + ': ' + `\**${owner.tag}\**` + '\n' + 'command.serverinfo.created'.trans() + ': ' + `\**${timeZoneConvert(message.guild.createdAt)}\**`)
            .addField(emoji.stats + ' ' + 'command.serverinfo.stats'.trans(), 'command.serverinfo.members'.trans() + ': ' + `\**${message.guild.memberCount}\**` + '\n' + 'command.serverinfo.upgrades'.trans() + ': ' + `\**${message.guild.premiumSubscriptionCount.toString()}\**` + '\n' + 'command.serverinfo.roles'.trans() + ': ' + `\**${message.guild.roles.cache.size}\**`, true)
            .addField(emoji.book + ' ' + 'command.serverinfo.details'.trans(), 'command.serverinfo.verification'.trans() + ': ' + `\**${verifLevels[message.guild.verificationLevel]}\**`, true)
            .addField(emoji.channel + ' ' + 'command.serverinfo.channels'.trans(), 'command.serverinfo.total'.trans() + ': ' + `\**${message.guild.channels.cache.size}\**` + '\n' + 'command.serverinfo.announcements'.trans() + ': ' + `\**${message.guild.channels.cache.filter(channel => channel.type == 'GUILD_NEWS').size}\**` + '\n' + 'command.serverinfo.station'.trans() + ': ' + `\**${message.guild.channels.cache.filter(channel => channel.type == 'GUILD_STAGE_VOICE').size}\**` + '\n' + 'command.serverinfo.threads'.trans() + ': ' + `\**${message.guild.channels.cache.filter(channel => channel.type == 'GUILD_PUBLIC_THREAD').size}\**` + '\n' + 'command.serverinfo.text'.trans() + ': ' + `\**${message.guild.channels.cache.filter(channel => channel.type == 'GUILD_TEXT').size}\**` + '\n' + 'command.serverinfo.voice'.trans() + ': ' + `\**${message.guild.channels.cache.filter(channel => channel.type == 'GUILD_VOICE').size}\**` + '\n' + 'command.serverinfo.category'.trans() + ': ' + `\**${message.guild.channels.cache.filter(channel => channel.type == 'GUILD_CATEGORY').size}\**`)
            .setColor(botConfig.embeds.color)
            .setFooter({ text: getFooter(message.member.user.tag), iconURL: message.author.avatarURL({ dynamic: true }) })

        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

    }
}
function input(text) {
    let join = `\`\`\``;
    return join + text + join;
}