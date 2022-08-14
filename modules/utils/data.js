const fs = require('fs');                   // Load filesystem node library
const path = require('path');
var MongoClient = require('mongodb').MongoClient;   // Load mongodb library
const {default: localizify, t} = require('localizify');         // Load localization library
const botConfig = require('@config/bot.js');
const { SlashCommandBuilder } = require('discord.js');
var os = require('os');
const Guild = require('@models/guild.js');

module.exports = {
    async getConfig(guild) {
        // if guild id is not specified then cancel the data request
        if (guild == null) return;
        let guildId = guild.id?.toString() || guild;
        
        return await Guild.findOneAndUpdate({id: guildId}, {$set: {id: guildId}}, { upsert: true });
    },

    async saveConfig(guild, settings) {
        delete settings._id;
        // localStorage.setItem(guild.id+'.settings', JSON.stringify(settings));
        // Initialize mongodb client
        const mongoClient = new MongoClient(process.env.MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true});
        
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
        var packageJson = require('../../package.json');
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
                    console.error('Error loading ' + fullPath + ' command');
                    console.error(error);
                }
                if (command !== undefined) {
                    command.category = path.basename(path.dirname(fullPath));
                    if(command.slashCommand) {

                        command.slashCommand = new SlashCommandBuilder()
                            .setName(command.name)
                            .setDescription(('command.'+command.name+'.description').trans());

                        command.args?.forEach(arg => {
                            if (arg.type == 'attachment') {
                                command.slashCommand.addAttachmentOption( option => module.exports.setOption(option, arg) );
                            } else if (arg.type == 'boolean') {
                                command.slashCommand.addBooleanOption( option => module.exports.setOption(option, arg) );
                            } else if (arg.type == 'channel') {
                                command.slashCommand.addChannelOption( option => module.exports.setOption(option, arg) );
                            } else if (arg.type == 'integer') {
                                command.slashCommand.addIntegerOption( option => module.exports.setOption(option, arg) );
                            } else if (arg.type == 'mentionable') {
                                command.slashCommand.addMentionableOption( option => module.exports.setOption(option, arg) );
                            } else if (arg.type == 'number') {
                                command.slashCommand.addNumberOption( option => module.exports.setOption(option, arg) );
                            } else if (arg.type == 'role') {
                                command.slashCommand.addRoleOption( option => module.exports.setOption(option, arg) );
                            } else if (arg.type == 'subcommand') {
                                command.slashCommand.addSubcommand( option => module.exports.setOption(option, arg) );
                            } else if (arg.type == 'subcommandGroup') {
                                command.slashCommand.addSubcommandGroup( option => module.exports.setOption(option, arg) );
                            } else if (arg.type == 'user') {
                                command.slashCommand.addUserOption( option => module.exports.setOption(option, arg) );
                            } else {
                                command.slashCommand.addStringOption( option => module.exports.setOption(option, arg) );
                            }
                        })

                    } 
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

    setOption(option, arg) {
        return option.setName(arg.name).setDescription(arg.description).setRequired(arg.optional === false);
    },

    getFooter(userName) {
        return 'footer.requester'.trans({
            user: userName || 'Unknown'
        });
    },

    getZumitoSettings() {
        var settings = JSON.parse(localStorage.getItem('zumito.settings'));
        return settings || {};
    },

    setZumitoSettings(json) {
        localStorage.setItem('zumito.settings', JSON.stringify(json))
    },
}