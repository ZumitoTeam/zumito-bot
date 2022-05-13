module.exports = {
    prefix: "z-", // Set your bot Prefix
    name: 'Zumito', // Set your bot name
    shortUrl: 'zumito.ga', // 
    URL: 'https://zumito.ga', //

    presence: {
        enable: true, // Whether or not the bot should update its status
        status: "online", // The bot's status [online, idle, dnd, invisible]
        type: "PLAYING",// Status type for the bot [PLAYING | LISTENING | WATCHING | COMPETING]
        message: "Bot Message", // Your bot status message
      },

    botInvite: { //
        inviteBanner: "https://media.discordapp.net/attachments/752920872318271504/879505391900295168/zumito_banner.png?width=1144&height=572",
        URLInvite: "https://zumito.ga/invite",
        URLSupport_Server: "https://zumito.ga/server",
        URLWebsite: "https://zumito.ga/"
    },

    media: { //
        botStatusIMG: "https://media.discordapp.net/attachments/879845851416121365/879846987317510255/zumito-cool.png?width=459&height=572",
    },

    embeds: { //
        color: "#f982a2"
    }
}