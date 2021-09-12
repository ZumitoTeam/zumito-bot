const { Discord, MessageActionRow, MessageEmbed, MessageButton } = require('discord.js');
const {default: localizify, t} = require('localizify');
const fetch = require("node-fetch");
const config = require('../../config.js');

// export module
module.exports = {
	name : "anime",
	description : "With this command you can search for information about your favorite anime.", 
	aliases : [], 
	ussage : '',
	examples:[], 
	hidden : false,
	admin : false,
    nsfw : false,
    
    async execute(client, message, args){
        const metadata = await fetch('https://kitsu.io/api/edge/anime?filter[text]=' + encodeURIComponent(args.join(' ')))
            .then(res => res.json());

            var embed
            if (metadata.data.length > 0 && metadata.data[0].attributes.coverImage != null) {
                // embed when results found
                embed = new MessageEmbed()
                .setColor(config.embeds.color)
                .setTitle(metadata.data[0].attributes.canonicalTitle)
                .setURL('https://kitsu.io/anime/' + metadata.data[0].attributes.slug)
                .setDescription("**Type:** " + metadata.data[0].type + "."  + "\n**Status:** "+ metadata.data[0].attributes.status + "." + " \n**Chapters:** " + metadata.data[0].attributes.episodeCount+" \n**Score:** " + metadata.data[0].attributes.averageRating + "/100 - #"+ metadata.data[0].attributes.ratingRank + "\n**Popularity:** "+ "#" + metadata.data[0].attributes.popularityRank + "\n**Transmission date:** " + metadata.data[0].attributes.startDate + " ~ " + metadata.data[0].attributes.endDate + "\n**NSFW:** " + metadata.data[0].attributes.nsfw)
                .setThumbnail(metadata.data[0].attributes.posterImage.medium)
                .setImage(metadata.data[0].attributes.coverImage.original)
                .setFooter(metadata.data[0].attributes.synopsis)

                await message.reply({embeds: [embed], allowedMentions: { repliedUser: false } });
            } else {
                // embed when no results found

                await message.channel.send('<:juice_face:879047636194316300> '+ "**" + message.author.username + ",**" + t(" the requested anime information was not found."));
            }
            

		
	}
}