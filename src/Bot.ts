import { ServiceContainer, ZumitoFramework } from 'zumito-framework';

import dotenv from 'dotenv'
dotenv.config()

import { config } from './config/index.js';
import path from 'path';
 
if (!process.env.DISCORD_TOKEN) {
    throw new Error("Discord Token not found");
} else if (!process.env.DISCORD_CLIENT_ID) {
    throw new Error("Discord Client ID not found");
} else if (!process.env.DATABASE_TYPE) {
    throw new Error("No database type specified in .env file"); 
} 

const __dirname = process.cwd();

new ZumitoFramework({
    discordClientOptions: {
        intents: 3276799,
        token: process.env.DISCORD_TOKEN!,
        clientId: process.env.DISCORD_CLIENT_ID!,
    },
    defaultPrefix: process.env.BOT_PREFIX || "z-",
    logLevel: parseInt(process.env.LOGLEVEL || "3"),
    statusOptions: config.statusOptions,
    mongoQueryString: process.env.MONGO_QUERY_STRING || "",
    bundles: [{
        path: path.join(__dirname, "node_modules", "@zumito-team", "admin-module"),
    }, {
        path: path.join(__dirname, "node_modules", "@zumito-team", "user-panel-module"),
    }]
}, (bot: ZumitoFramework) => { // Callback function when bot is ready
    // Log number of commands loaded
    console.log(`Loaded ${bot.commands.size} commands`);
    // Log number of events loaded
    console.log(`Loaded ${bot.events.size} events`);
    // Log number of modules loaded
    console.log(`Loaded ${bot.modules.size} modules`);
    // Log number of translations loaded
    console.log(`Loaded ${bot.translations.getAll().size} translations`);
})