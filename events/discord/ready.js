const bot = require('@config/bot.js');
const botConfig = require('@config/bot.js');

module.exports = {
    event: "ready",
    once: true,
    async execute(message, client) {
        console.info('[✅] ' + client.user.username + ' is Ready!');

        // Activities 
        setInterval(async () => {
            const { getBotVersion } = require("@modules/utils/data.js");
            client.user.setPresence({
                status: botConfig.presence.status ,
                activities: [{
                    name: botConfig.presence.message,
                    type: botConfig.presence.type
                }]
            });
        }, 60000);

        client.guilds.cache.forEach(async (guild) => {
            const { getConfig } = require("@modules/utils/data.js");
            var settings = await getConfig(guild);
            if (settings.tickets !== undefined) {
                settings.tickets.forEach(function(ticket) {
                    var message;
                    if (ticket.message !== undefined) {
                        message = guild.channels.cache.get(ticket.channel.id).fetchMessage(messageID).then(message => {

                        });
                    } else {

                    }
                });
            }
        })
    }
}