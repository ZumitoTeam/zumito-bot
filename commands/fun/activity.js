const { DiscordTogether } = require('discord-together');
require("@modules/localization.js");

module.exports = {
	name : "activity",
	aliases : ["activities", "start-activity"],
	ussage : ["activity youtube"],
	hidden : false,
	admin : false,
	nsfw : false,
	async execute(client, message, args) {
        if(!message.member.voice.channel) return message.reply({ content: "commands.activity.notInChannel".trans()});
        if(!args[0]) return message.reply("commands.activity.invalidActivity".trans()); 
        const discordTogether = new DiscordTogether(client);
        let invite;
        try {
            invite = await discordTogether.createTogetherCode(message.member.voice.channel.id, args[0])
        } catch (e) {}
        if(!invite) return message.reply("commands.activity.error".trans());
        if(invite.code) return message.reply(`${invite.code}`);
        return message.reply("commands.activity.failedToStart".trans());
    }
}