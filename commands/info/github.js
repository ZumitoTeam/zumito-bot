// init require
const Discord = require('discord.js');
const { getFooter } = require("@modules/utils/data.js");
const { t } = require('localizify');
const fetch = require("node-fetch");
const botConfig = require('@config/bot.js');

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


        if (args[0] === undefined) return await message.reply({ content : "Enter a valid username", allowedMentions: { repliedUser: false } });
        const git = await fetch('https://api.github.com/users/' + (args.join(' ')))
            .then(res => res.json())
            .catch(async err => { });
        if (git === undefined || git.name === undefined) return await message.reply({ content: "Enter a valid user name....", allowedMentions: { repliedUser: false } });

        let embed = new Discord.MessageEmbed()
            .setAuthor({
                name: `GitHub User:` + git.name,
                url: git.html_url,
                iconURL: git.avatar_url,
            })

            .addField(t("User Info"), "**" + t("Real Name") + "**: " + `${git.login || "Not Provided"}` + "\n" + " **" + t("Location") + "**: " + `${git.location || "Not Provided"}` + "\n" + "**" + t("GitHub ID") + "**: " + `${git.id}` + "\n" + "**" + t("Website") + "**: " + `[Click me](${git.blog})`, true)
            .addField("Social Stats", "**" + t("Followers") + "**: " + `${git.followers}` + "\n" + "**" + t("Following") + "**: " + `${git.following}`, true)
            .setDescription(`**Bio**:\n${git.bio || "Not Provided"}`)
            .setImage(git.avatar_url)
            .setColor(botConfig.embeds.color)
            .setFooter({ text: getFooter(message.author.username), iconURL: message.author.avatarURL() })
            .setTimestamp();

        await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });


    }
}