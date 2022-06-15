// init require
const Discord = require('discord.js');
const { t } = require('localizify');
const { getBotVersion, getFooter } = require("@modules/utils/data.js");


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
			.setTitle("<a:boostingtop:754135617612415147>" + t('Server information'))
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField(t('Name') + ":", message.guild.toString() || 'error getting value', true)
            .addField(t('Owner') + ":", `<@${message.guild.ownerId}>`)
            .addField(t('Server ID') + ":", message.guild.id || 'error getting value')
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
		)
		return message.reply({embeds: [embed]});
	}
}
function input(text) {
    let join = `\`\`\``;
    return join + text + join;
}
//.addField(t('')+":","")