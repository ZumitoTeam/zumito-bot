// init require
const Discord = require('discord.js');
const botConfig = require("@config/bot.js");
const { t } = require('localizify');
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
            'NONE': t("None"),
            "LOW": t("Low"),
            "MEDIUM": t("Medium"),
            "HIGH": "(╯°□°）╯︵  ┻━┻",
            "VERY_HIGH": "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
        };
        let region = {
            "brazil": ":flag_br: Brazil",
            "eu-central": ":flag_eu: Central Europe",
            "singapore": ":flag_sg: Singapore",
            "us-central": ":flag_us: U.S. Central",
            "sydney": ":flag_au: Sydney",
            "us-east": ":flag_us: U.S. East",
            "us-south": ":flag_us: U.S. South",
            "us-west": ":flag_us: U.S. West",
            "eu-west": ":flag_eu: Western Europe",
            "vip-us-east": ":flag_us: VIP U.S. East",
            "london": ":flag_gb: London",
            "amsterdam": ":flag_nl: Amsterdam",
            "hongkong": ":flag_hk: Hong Kong",
            "russia": ":flag_ru: Russia",
            "southafrica": ":flag_za:  South Africa"
        };

        let bans = await message.guild.bans.fetch();

        const embed = new Discord.MessageEmbed()
            .setTitle(emoji.boost + ' ' + 'command.serverinfo.title'.trans())
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField(emoji.info + ' ' + 'command.serverinfo.info'.trans(), '┕ **' + 'command.serverinfo.name'.trans() + ':** ' +  `\`${message.guild.toString() || 'command.serverinfo.error'.trans()}\`` + '\n┕ **' + 'command.serverinfo.owner'.trans()  + ':** ' + `<@${message.guild.ownerId}>` + '\n┕ **' + 'command.serverinfo.id'.trans() + ':** ' + `\`${message.guild.id || 'command.serverinfo.error'.trans()}\``, true)
            .addField('command.serverinfo.members'.trans(), "teeed", true)
            .setColor(botConfig.embeds.color)
        /*
        .addField(t('Members')+':', 
            '<:online:761996014546321409>'+message.guild.members.cache.filter(member => member.presence.status !== 'offline' ).size + ' ' + t('Online') +'\t' +
            '<:bota:754068946889605200>'+message.guild.members.cache.filter(member => member.user.bot ).size + ' ' + t('Bots') +'\t' +    
            '<:offline:761996014780678146>'+message.guild.members.cache.size + ' ' + t('Members') +'\t'
        )
        .addField(t("Verification Level") + ":", verifLevels[message.guild.verificationLevel], true)
        .addField(t('Boost') + ":", '<:boost:761953856292388904>'+ ' ' +t('{count} upgrades', {count: message.guild.premiumSubscriptionCount.toString()}) + ' ('+t('Level {level}', {level: message.guild.premiumTier.toString()})+ ')')
        .addField(t('Channels') + ":", 
        '<:textchannel:761996014453391360> ' + message.guild.channels.cache.filter(channel => channel.type == 'text').size + ' ' + t('Text channels') + ' • ' + 
        '<:voicechannel:761996014500184105> ' + message.guild.channels.cache.filter(channel => channel.type == 'voice').size + ' ' + t('Voice channels')
        )
        //.addField(t('Region') + ":", region[message.guild.region] || 'error getting value')
        .addField(t("Roles") + ":", message.guild.roles.cache.size.toString() || 'error getting value')
        .addField(t('Bans') + ':', '<:ban:761996014726152233> '+ bans.size)
        .setColor("RED");
    embed.setFooter(
        //t('Requested by') + ": " + user.tag,
        getFooter(message.member.user.tag),
        user.avatarURL({ dynamic: true })
    )*/
        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
}
function input(text) {
    let join = `\`\`\``;
    return join + text + join;
}
//.addField(t('')+":","")