const { getConfig } = require("@modules/utils/data.js");
const {default: localizify, t} = require('localizify');  
const botConfig = require('@config/bot.js');
const fs = require('fs')

module.exports = {
    event: "interactionCreate",
    once: false, // Event can be called multiple times
    async execute(interaction, client) {

        var settings = await getConfig(interaction.guild);

        if(interaction.isCommand()) {
            let args = [] //interaction.options?.map(section => section);
            if(!client.commands.has(interaction.commandName)) return;
            const comid = client.commands.get(interaction.commandName);
            if (!comid.slashCommand) return;
            localizify.setLocale(settings?.lang || 'en');
            if (comid.executeSlashCommand) {
                await comid.executeSlashCommand(client, interaction, args);
            } else {
                await comid.execute(client, interaction, args);
            }
        } else if(interaction.isButton()) {
            
        } else if(interaction.isSelectMenu()) {
            console.log('interaction', interaction.customId);
            if (fs.existsSync("@commands/"+interaction.customId+".js")) {
                let event = require("@commands/"+interaction.customId+".js");
            }
        } else if(interaction.isUserContextMenu()) {
            
        }
    }
}