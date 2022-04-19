const botConfig = require('@config/bot.js');
const fs = require('fs')

module.exports = {
    event: "interactionCreate",
    once: false,
    async execute(interaction, client) {
        if (interaction.isCommand()) {

        } else if (interaction.isSelectMenu()) {
            console.log('interaction', interaction.customId);
            if (fs.existsSync("@commands/"+interaction.customId+".js")) {
                let event = require("@commands/"+interaction.customId+".js");
            }
        }
    }
}