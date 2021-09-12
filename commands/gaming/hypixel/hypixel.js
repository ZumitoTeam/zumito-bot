const { Discord, MessageActionRow, MessageEmbed, MessageButton, MessageSelectMenu } = require('discord.js');
const { default: localizify, t } = require('localizify');
const fetch = require("node-fetch");
const config = require('../../../config.js');

// export module
module.exports = {
    name: "hypixel", // comando sin el prefix
    description: "", // descripcion del comando (En ingles)
    aliases: [], // alias del comando en "" separados por , sin el prefix
    ussage: '',
    examples: [],
    hidden: false,
    admin: false,
    nsfw: false,

    async execute(client, message, args) {

        let ranks = {
            "VIP_PLUS": "[VIP+] ",
            "VIP": "[VIP] ",
            "undefined": "",
            "MVP": "[MVP] ",
            "MVP_PLUS": "[MVP+] ",
            "MVP_PLUS_PLUS": "[MVP++] "
        };
        let ranksicon = {

        };
        if (args[0] === undefined) return await message.reply(t('Player username is mandatory.'));
        const uuidData = await fetch('https://api.mojang.com/users/profiles/minecraft/' + (args.join(' ')))
            .then(res => res.json())
            .catch(async err => { });
        if (uuidData === undefined) return await message.reply(t("This player never played on Hypixel."));
        //console.log(uuidData);

        if (args[1] === undefined) {
            const metadata = await fetch('https://api.hypixel.net/player?uuid=' + encodeURIComponent(uuidData.id), {
                headers: {
                    'API-Key': 'd2b537c1-15db-4a22-a004-41e29ac8f60a'
                }
            }).then(res => res.json());
    
            //console.log(metadata);
            var embed;
            if (metadata.success == true) {
    
                embed = new MessageEmbed()
                    .setColor(config.embeds.color)
                    .setAuthor('Hypixel Profile', 'https://media.discordapp.net/attachments/879845851416121365/882063243282108486/Hypixel.png')
                    .setThumbnail('https://crafatar.com/renders/head/' + encodeURIComponent(uuidData.id))
                    .setDescription('**information:**')
                    .addField('Name: ', ranks[metadata.player.newPackageRank] + metadata.player.displayname, true)
                    .addField('Status', 'Ofline', true);
    
                //.setTitle(ranks[metadata.player.newPackageRank] + metadata.player.displayname)
                //.addField("Karma: ", '0')
                //.setDescription("Karma:" + (metadata.player.karma || '0'))
                //.setDescription('Informacion basica sobre: ' + ranks[metadata.player.newPackageRank] +  metadata.player.displayname)
                //.setThumbnail('https://crafatar.com/renders/head/' + encodeURIComponent(uuidData.id))
                //.setDescription("karma " + (metadata.player.karma || '0') + "\nTest: " + (ranks[metadata.player.newPackageRank]  || '0'))
    
                await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    
            }
        } else {
            switch (args[1]) {
                case 'bedwars':
                    const metadata = await fetch('https://api.hypixel.net/player?uuid=' + encodeURIComponent(uuidData.id), {
                        headers: {
                            'API-Key': 'd2b537c1-15db-4a22-a004-41e29ac8f60a'
                        }
                    }).then(res => res.json());

                    //console.log(metadata);
                    var embed;
                    if (metadata.success == true) {
                        embed = new MessageEmbed()
                            .setColor(config.embeds.color)
                            .setAuthor('Hypixel Profile', 'https://media.discordapp.net/attachments/879845851416121365/882063243282108486/Hypixel.png')
                            .setThumbnail('https://crafatar.com/renders/head/' + encodeURIComponent(uuidData.id))
                            .setDescription('**information:**')
                            .addField('Name: ', ranks[metadata.player.newPackageRank] + metadata.player.displayname, true)
                            .addField('Status', 'Ofline', true)
                        await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                    }
                    break;
                case 'skywars':
                    const metadata = await fetch('https://api.hypixel.net/player?uuid=' + encodeURIComponent(uuidData.id), {
                        headers: {
                            'API-Key': 'd2b537c1-15db-4a22-a004-41e29ac8f60a'
                        }
                    }).then(res => res.json());

                    //console.log(metadata);
                    var embed;
                    if (metadata.success == true) {
                        embed = new MessageEmbed()
                            .setColor(config.embeds.color)
                            .setAuthor('Hypixel Profile', 'https://media.discordapp.net/attachments/879845851416121365/882063243282108486/Hypixel.png')
                            .setThumbnail('https://crafatar.com/renders/head/' + encodeURIComponent(uuidData.id))
                            .setDescription('**information:**')
                            .addField('Name: ', ranks[metadata.player.newPackageRank] + metadata.player.displayname, true)
                            .addField('Status', 'Ofline', true);
                        await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                    }
                    break;
            }
        }

        
    }
}
