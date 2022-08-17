const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const botConfig = require("@config/bot.js");
const { getFooter } = require("@modules/utils/data");
const emojis = require("@config/emojis.js");
require("@modules/localization.js");

module.exports = {
  name: "botinvite",
  aliases: ["invite"],
  examples: [],
  permissions: [],
  botPermissions: [],
  hidden: false,
  admin: false,
  nsfw: false,
  cooldown: 0,
  slashCommand: true,
  dm: true,

  async execute(client, message, args) {
    var embed = new EmbedBuilder()

      .setAuthor({
        name: "command.botinvite.author".trans() + " " + botConfig.name,
      })
      .setColor(botConfig.embeds.color)
      .setDescription(
        "command.botinvite.description".trans() + " " + emojis.cozysip
      )
      .setImage(
        "https://raw.githubusercontent.com/fernandomema/Zumito/botinvite/assets/images/invite.png"
      );

    const row = new ActionRowBuilder()
	.addComponents(
      new ButtonBuilder()
        .setLabel('command.botinvite.invite'.trans())
        .setStyle(ButtonStyle.Link)
        .setURL(botConfig.botInvite.URLInvite)
       .setEmoji('988649262042710026'),
      new ButtonBuilder()
        .setLabel('command.botinvite.support'.trans())
        .setStyle(ButtonStyle.Link)
        .setURL(botConfig.botInvite.URLSupport)
       .setEmoji('879509411285045279'),
      new ButtonBuilder()
        .setLabel('command.botinvite.website'.trans())
        .setStyle(ButtonStyle.Link)
        .setURL(botConfig.botInvite.URLWebsite)
        .setEmoji('879510323676200980')
	);

    return message.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
      ephemeral: true,
      components: [row],
    }); //, components: [row]
  },
};
