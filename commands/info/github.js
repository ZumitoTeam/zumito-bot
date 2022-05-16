const Discord = require('discord.js');
const { getFooter } = require("@modules/utils/data.js");
const fetch = require("node-fetch");
const botConfig = require('@config/bot.js');
const emojis = require('@config/emojis');
require("@modules/localization.js");

module.exports = {
    name: "github",
    description: "shows github statistics of a user",
    aliases: [],
    category: "Info",
    ussage: null,
    hidden: false,
    admin: false,
    nsfw: false,

    async execute(client, message, args) {

        if (args[0] === undefined)

            return await message.reply({ content: emojis.deny + 'command.github.valid_username'.trans(), allowedMentions: { repliedUser: false } });

        const git = await fetch('https://api.github.com/users/' + (args.join(' ')))
            .then(res => res.json())
            .catch(async err => { });

        if (git === undefined || git.name === undefined) 
        
        return await message.reply({ content: emojis.deny + 'command.github.enter_valid_user'.trans(), allowedMentions: { repliedUser: false } });

        let embed = new Discord.MessageEmbed() 
            .setAuthor({
                name: 'command.github.author'.trans()+ ' ' + git.name,
                url: git.html_url,
                iconURL: git.avatar_url,
            })

            .setDescription('**' + 'command.github.bio'.trans() + '**' + `\n${git.bio || 'command.github.not_provided'.trans()}`) // Not Provided
            .addField('command.github.user_info'.trans(), "**" + 'command.github.real_name'.trans() + "**: " + `${git.login || 'command.github.not_provided'.trans()}` + "\n" + " **" + 'command.github.location'.trans() + "**: " + `${git.location || 'command.github.not_provided'.trans()}` + "\n" + "**" + 'command.github.github_id'.trans() + "**: " + `${git.id}`, true)
            .addField('command.github.social_stats'.trans(), "**" + 'command.github.followers'.trans() + "**: " + `${git.followers}` + "\n" + "**" + 'command.github.following'.trans() + "**: " + `${git.following}`, true)
            .setImage(git.avatar_url)
            .setColor(botConfig.embeds.color)
            .setFooter({ text: getFooter(message.author.username), iconURL: message.author.avatarURL({ dynamic: true }) })
            .setTimestamp();

        await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });


    }
}