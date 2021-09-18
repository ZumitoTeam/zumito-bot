const fs = require('fs');                   // Load filesystem node library
const path = require('path');
const { Collection, Client, Intents } = require('discord.js');              // Load discord js library
require('better-logging')(console);         // Load better logging
const {default: localizify, t} = require('localizify');         // Load localization library
var LocalStorage = require('node-localstorage').LocalStorage;   // Load local storage library for node
const {loadCommands} = require('./utils/data.js');
const {getErrorEmbed} = require('./utils/debug.js');


console.logLevel = process.env.LOGLEVEL || 3;

const client = new Client({ 
    intents: [
        "GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", 
        "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", 
        "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", 
        "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGE_REACTIONS", 
        "DIRECT_MESSAGES"
    ]
});
client.getErrorEmbed = getErrorEmbed;

if (process.env.DEBUG == true || process.env.DEBUG == 'true') {
    let {initializeDebug} = require('./utils/debug.js');
    initializeDebug(client);
}

// Load languages
const en = require('./localization/en.json');
const es = require('./localization/es.json');
localizify
  .add('en', en)
  .add('es', es)
  .setLocale('en');

// Initialize local storage
localStorage = new LocalStorage('./data');

// Define commands
const cmdir = path.resolve('./commands');
client.commands = new Collection();
localStorage.setItem('commands', JSON.stringify(loadCommands(client, cmdir)));

// Event handler
fs.readdir('./events/discord', (err, files) => { // We use the method readdir to read what is in the events folder
    if (err) return console.error(err); // If there is an error during the process to read all contents of the ./events folder, throw an error in the console
    files.forEach(file => {
        const eventFunction = require(`./events/discord/${file}`); // Here we require the event file of the events folder
        if (eventFunction.disabled) return; // Check if the eventFunction is disabled. If yes return without any error

        const event = eventFunction.event || file.split('.')[0]; // Get the exact name of the event from the eventFunction variable. If it's not given, the code just uses the name of the file as name of the event
        const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client; // Here we define our emitter. This is in our case the client (the bot)
        const once = eventFunction.once; // A simple variable which returns if the event should run once

        // Try catch block to throw an error if the code in try{} doesn't work
        try {
            emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.execute(...args, client)); // Run the event using the above defined emitter (client)
        } catch (error) {
            console.error(error.stack); // If there is an error, console log the error stack message
        }
    });
});

client.once('ready', () => {
	console.info(client.user.username + ' is Ready!');

    // Activities 
	setInterval(async () => {
        const { getBotVersion } = require("./utils/data.js");
		client.user.setPresence({
			status: "online",
			activity: {
				name: 'Zumito 🧃'+getBotVersion(),
				type: "PLAYING" // https://discord.js.org/#/docs/main/stable/typedef/ActivityType
			}
		});
	}, 60000);

	client.guilds.cache.forEach(async (guild) => {
		const { getConfig } = require("./utils/data.js");
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

});

client.login(process.env.TOKEN)