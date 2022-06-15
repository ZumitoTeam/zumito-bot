// init require
const Discord = require('discord.js');
const DiscordPages = require("discord-pages");
const botConfig = require('@config/bot.js');


// export module
module.exports = {
    name : "emojilist",
    description : "List guild emojis and their respective id",
    aliases : ["emoji"],
    ussage : 'emojilist',
    ussage : null,
    hidden : true,
    admin : false,
    nsfw : false,
    async execute(client,message,args){
        const emojis = message.guild.emojis.cache;
        var embeds = [];

        var index = -1;
        var subIndex = -1;
        emojis.forEach(function(emoji){
            subIndex++;
            if (subIndex%10 == 0) {
                index++;
                embeds[index] = new Discord.MessageEmbed()
                .setTitle("Emoji list")
                .setColor(botConfig.embeds.color);
            }
            embeds[index].addField(emoji.toString() + ' ' + emoji.name, '```' + emoji.toString() + '```');
        });

        const embedPages = new DiscordPages({ 
            pages: embeds, 
            channel: message.channel, 
        });
        embedPages.createPages();

        
    }
}

function chunkArrayInGroups(arr, size) {
    var myArray = [];
    for(var i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i+size));
    }
    return myArray;
  }

  function chunk(array, size) {
    if (!array) return [];
    const firstChunk = array.slice(0, size); // create the first chunk of the given array
    if (!firstChunk.length) {
      return array; // this is the base case to terminal the recursive
    }
    return [firstChunk].concat(chunk(array.slice(size, array.length), size)); 
  }

  function chunkArray(myArray, chunk_size){
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];
    
    for (index = 0; index < arrayLength; index += chunk_size) {
        myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}