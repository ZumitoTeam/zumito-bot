const fs = require('fs');                   // Load filesystem node library
const path = require('path');
var MongoClient = require('mongodb').MongoClient;   // Load mongodb library
const {default: localizify, t} = require('localizify');         // Load localization library

module.exports = {
    async getConfig(guild) {
        // if guild id is not specified then cancel the data request
        if (guild == null) return;
        
        // Initialize mongodb client
        const mongoClient = new MongoClient(('mongodb://root:Lolhd135%40%40st@servitimo.net:27017' || process.env.MONGOURI), {useNewUrlParser: true, useUnifiedTopology: true});
        
        // connect and wait for connection
        await mongoClient.connect();

        // Select zumito database
        var db = mongoClient.db("zumito");
        // select guilds collection
        var guilds = db.collection('guilds');
        // retrieve guild settings
        var settings = await guilds.findOne({"id": guild.id.toString()});
        // close database connection
        await mongoClient.close();

        // Reassign settings to old database settings if no data exists on mongo database.
        if (settings == null || settings === undefined) settings = JSON.parse(localStorage.getItem(guild.id+'.settings'));
        // Reassign settings to empty data set if no data exists on mongo database.
        if (settings == null || settings === undefined) settings = {};

        // define new settings
        if (settings.prefix === undefined) {
            settings.prefix = 'z-';
        }
        if (settings.lang === undefined) {
            settings.lang = 'en';
        }
        if (settings.public === undefined) {
            settings.public = false;
        }
        if (settings.deleteCommands === undefined) {
            settings.deleteCommands = false;
        }
        if (settings.mutedUsers === undefined || settings.mutedUsers.length == 0) {
            settings.mutedUsers = {};
        }
        if (settings.welcome === undefined) {
            settings.welcome = {};
        }
        if (settings.welcome.enabled === undefined) {
            settings.welcome.enabled = false;
        }
        if (settings.welcome.randomMessage === undefined) {
            settings.welcome.randomMessage = {
                enabled: false,
                channel: '',
                messages: []
            };
        }
        if (settings.welcome.image === undefined) {
            settings.welcome.image = {
                enabled: false,
                channel: '',
                theme: ''
            };
        }
        if (settings.welcome.customMessage === undefined) {
            settings.welcome.customMessage = {
                enabled: false,
                channel: '',
                embed: {}
            };
        }
        if (settings.welcome.privateDM === undefined) {
            settings.welcome.privateDM = {
                enabled: false,
                channel: '',
                message: ''
            };
        }
        if (settings.welcome.joinRole === undefined) {
            settings.welcome.joinRole = {
                enabled: false,
                role: null
            };
        }
        if (settings.filterInvites === undefined) {
            settings.filterInvites = {
                enabled: false,
                warn: false,
                bypassOwner: true,
                bypassRoles: []
            }
        }
        if (settings.filterInvites.delete === undefined) {
            settings.filterInvites.delete = true;
        }
        if (settings.userData === undefined || settings.mutedUsers.length == 0) {
            settings.userData = {};
        }
        if (settings.virtualCoin === undefined) {
            settings.virtualCoin = {
                enabled: true,
                nameSingular: 'coin',
                namePlural: 'coins'
            }
        }
        if (settings.cleanChannels === undefined) {
            settings.cleanChannels = {};
        }
        if (settings.warns === undefined) {
            settings.warns = [];
        }
        if (settings.tickets === undefined) {
            settings.tickets = [];
        }
        if (settings.bannedUsers === undefined) {
            settings.bannedUsers = [];
        }
        if (settings.confession === undefined) {
            settings.confession = {
                enabled: false,
                channel: null,
            };
        }

        if (settings.moderation === undefined) {
            settings.moderation = {
                "channels": {
                    "kickChannelId": null,
                    "banChannelId": null,
                    "warnChannel": null,
                    "muteChannel": null
                }
            };
        }
        
        return settings;
    },

    async saveConfig(guild, settings) {
        delete settings._id;
        // localStorage.setItem(guild.id+'.settings', JSON.stringify(settings));
        // Initialize mongodb client
        const mongoClient = new MongoClient("mongodb://root:Lolhd135%40%40st@servitimo.net:27017", {useNewUrlParser: true, useUnifiedTopology: true});
        
        // connect and wait for connection
        await mongoClient.connect();

        // Select zumito database
        var db = mongoClient.db("zumito");
        // select guilds collection
        var guilds = db.collection('guilds');

        const query = { "id": guild.id.toString() };
        const update = { $set: settings};
        const options = { upsert: true };
        await guilds.updateOne(query, update, options);
        // close database connection
        await mongoClient.close();
    },

    getBotVersion() {
        var packageJson = require('../package.json');
        return packageJson.version;
    },

    loadCommands(client, dir) {
        var commands = [];
        //return [];
        fs.readdirSync(dir, {"flag": 'rs'}).forEach(file => {
            let fullPath = path.join(dir, file);
            if (fs.lstatSync(fullPath).isDirectory()) {
                commands.push(...module.exports.loadCommands(client, fullPath));
            } else {
                delete require.cache[require.resolve(fullPath)];
                let command;
                try {
                    command = require(`${fullPath}`);
                } catch(error) {
                    console.error('[❎ ] Error loading ' + fullPath + ' command');
                    let channel = client.channels.cache.get("888890309025595473");
                    if (channel !== undefined) {
                        channel.send({embeds: [client.getErrorEmbed({
                            name: error.name,
                            message: error.message,
                            comid: fullPath.replace(/^.*[\\\/]/, '').split('.').slice(0, -1).join('.'),
                        }, true)]});
                    }
                }
                if (command !== undefined) {
                    command.category = fullPath.substring(fullPath.indexOf('/') + 1, fullPath.lastIndexOf('/'));
                    commands.push(command);
                    // set a new item in the Collection
                    // with the key as the command name and the value as the exported module
                    client.commands.set(command.name, command);
                    //console.debug(`Loading: ${file}`)
                    if (command.aliases !== undefined) {
                        // with the key as the each of command aliases and the value as the exported module
                        command.aliases.map(e=>{
                            client.commands.set(e, command);
                        })
                    }
                }
            }  
        });
        return commands;
    },

    getFooter(userName) {
        return t('Requested by:') + ' ' + (userName || 'Unknown')+' - '+ t('Visit') +': zumito.ga';
    },

    getTulipoSettings() {
        var settings = JSON.parse(localStorage.getItem('tulipo.settings'));
        return settings || {};
    },

    setTulipoSettings(json) {
        localStorage.setItem('tulipo.settings', JSON.stringify(json))
    },
}