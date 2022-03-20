const { t } = require("localizify");
const botConfig = require("@config/bot.js");
const { getFooter } = require("@modules/utils/data");
const { MessageEmbed, Permissions } = require("discord.js");
const test = require("@modules/localization.js");

module.exports = {
	name : "clear", 
	aliases : ['purge'],
	ussage : 'clear [amount]',
	examples: ["clear 10", "clear 100"],
	permissions: [Permissions.FLAGS.MANAGE_CHANNELS], 
	botPermissions: [], 
	hidden : true,  
	admin : false,  
	nsfw : false,  
	cooldown: 0, 

	async execute(client, message, args) {
        let amount = parseInt(args[0]);
        if (isNaN(amount) === true || !amount || amount < 0)
        return message.reply("commands.clear.invalidAmount".trans()); // Please provide a message count between 1 and 100
        if (amount > 100) amount = 100;

        // Check channel permissions
        if (!message.channel.permissionsFor(message.guild.me).has(['MANAGE_MESSAGES']))
        return message.reply('commands.clear.noPerms'.trans()); // 'I do not have permission to manage messages in the provided channel'

        await message.delete(); // Delete command message

        const messages = await message.channel.bulkDelete(amount, true);
        const embed = new MessageEmbed()
            .setTitle('Purge')
            .setDescription(
                t( 'commands.clear.purged', {amount: messages.size} )
            )
            .addField('generic.channel'.trans() + ':', message.channel.toString(), true)
            .addField('commands.clear.message_count'.trans() + ':', `\`${messages.size}\``, true) // Message count
            .setFooter({
                text: getFooter(message.member.user.tag),
                iconURL: message.author.avatarURL({ dynamic: true }),
            })
            .setColor(botConfig.embeds.color);

        await message.channel.send({embeds: [embed]})
    }
}