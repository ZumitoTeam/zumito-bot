import { ZumitoFramework } from 'zumito-framework';

require("dotenv").config();

if (!process.env.TOKEN) {
    throw new Error("Discord Token not found");
} else if (!process.env.CLIENT_ID) {
    throw new Error("Discord Client ID not found");
} else if (!process.env.MONGOURI) {
    throw new Error("Mongo URI not found");
} 
new ZumitoFramework({
    discordClientOptions: {
        intents: 3276799,
        token: process.env.TOKEN!,
        clientId: process.env.CLIENT_ID!,
    },
    defaultPrefix: process.env.BOTPREFIX || "z-",
    mongoQueryString: process.env.MONGOURI!,
})