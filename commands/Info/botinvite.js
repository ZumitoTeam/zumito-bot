// init require
const Discord = require('discord.js');
const { getFooter } = require("@modules/utils/data.js");
const { t } = require('localizify');
const botConfig = require('@config/bot.js');

// export module
module.exports = {
	name: "botinvite",
	description: "Get tulipo invite urls",
	aliases: ["invite"],
	category: "Info",
	ussage: null,
	hidden: false,
	admin: true,
	nsfw: false,
	async execute(client, message, args) {
		// TODO: add message "Invite sended to DM", and send to the current channel and auto delete in 5 seconds 
		var embed = new Discord.MessageEmbed()
			.setAuthor({ name: t("Invite to " + botConfig.name), iconURL: "" })
			.setColor(botConfig.embeds.color)
			.setDescription(t('Here is the invitation link for you to invite me to your server.') + ' <:juice_face:879047636194316300>')
			.setImage(botConfig.botInvite.inviteBanner)

		const row = new Discord.MessageActionRow()
			.addComponents(
				new MessageButton()
					.setLabel(t('Invite'))
					.setStyle('LINK')
					.setURL(botConfig.botInvite.URLInvite)
					.setEmoji('879047987177852978'),

				new MessageButton()
					.setLabel(t('Support'))
					.setStyle('LINK')
					.setURL(botConfig.botInvite.URLSupport_Server)
					.setEmoji('879509411285045279'),

				new MessageButton()
					.setLabel(t('Website'))
					.setStyle('LINK')
					.setURL(botConfig.botInvite.URLWebsite)
					.setEmoji('879510323676200980')
			);

			return  message.author.send({ components: [row], embeds: [embed] });

	}

}
