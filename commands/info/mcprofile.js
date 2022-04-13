const Discord = require('discord.js');
const { t } = require('localizify');
const fetch = require("node-fetch");
const botConfig = require('@config/bot.js');
require("@modules/localization.js");

// export module
module.exports = {
    name: "mcprofile",
    description: "", 
    aliases: [],
    ussage: '',
    examples: [],
    hidden: false,
    admin: false,
    nsfw: false,

    async execute(client, message, args) {


        if (args[0] === undefined) return await message.reply('commands.mcprofile.playerRequired'.trans());
        const uuidData = await fetch('https://api.mojang.com/users/profiles/minecraft/' + (args.join(' ')))
            .then(res => res.json())
            .catch(async err => { });
        if (uuidData === undefined) return await message.reply("commands.mcprofile.notFound".trans());
        console.log(uuidData);

        var embed;

        embed = new Discord.MessageEmbed()
            .setTitle(t("Minecraft Profile"))
            .setColor(botConfig.embeds.color)
            //.setThumbnail('https://crafatar.com/renders/head/' + encodeURIComponent(uuidData.id))
            .setThumbnail('https://crafatar.com/avatars/' + encodeURIComponent(uuidData.id))
            .setImage('https://crafatar.com/renders/body/' + encodeURIComponent(uuidData.id))
        

        await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });


    }


}