var chokidar = require('chokidar');
const path = require('path');
const {loadCommands} = require('../utils/data.js');
const { MessageEmbed } = require('discord.js');
const config = require('../config.js');
const chalk = require('chalk');

module.exports = {
    initializeDebug(client) {
        module.exports.client = client;
        this.watcher = chokidar.watch(path.resolve(__dirname + '/../commands'), {ignored: /^\./, persistent: true, ignoreInitial: true})
        .on('add', module.exports.onAdd)
        .on('change', module.exports.onChange)
        //.on('unlink', function(path) {console.log('File', path, 'has been removed');})
        .on('error', module.exports.onError);
    }, 

    onChange(file) {
        console.debug('[🔄 ] Command ' + chalk.blue(file.replace(/^.*[\\\/]/, '').split('.').slice(0, -1).join('.')) + ' reloaded');
        loadCommands(module.exports.client, path.resolve(__dirname + '/../commands'));
    },

    onAdd(file) {
        console.debug('Added ' + file + ' command');
        //loadCommands(module.exports.client, path.resolve(__dirname + '/../commands'));
    },

    onError(error) {
        console.error(error);
    },

    parseError(error) {
        error.possibleSolutions = [];
        if (/(?:^|(?<= ))(MessageEmbed|Discord|MessageActionRow|MessageButton|MessageSelectMenu)(?:(?= )|$) is not defined/gm.test(error.message)) {
            error.possibleSolutions.push('const { ' + error.message.split(" ")[0] + ' } = require(\'discord.js\');');
        } else if (error.message.includes('A custom id and url cannot both be specified')) {
            error.possibleSolutions.push("Remove .setCustomId(...) or .setURL(...)");
        }
        return error;
    },

    getErrorEmbed(error, parse) {
        let parsedError;
        if (parse) {
            parsedError = module.exports.parseError(error);
        } else {
            parsedError = error;
        }
        let embed = new MessageEmbed()
        .setTitle("Error running command")
        .setColor(config.embeds.color)
        .setDescription("There is an error running your command. Please contact developers to solve this issue.")
        .setTimestamp()
        .addField('Command:', (error.comid.name || 'not defined'));
        if (error.args !== undefined) {
            embed.addField('Arguments:', (error.args.toString() || 'none'));

        }
        embed.addField('Error:', (error.name || 'not defined'))
        .addField('Error message:', (error.message || 'not defined'));
        if (error.possibleSolutions !== undefined) {
            error.possibleSolutions.forEach((solution) => {
                embed.addField('Posible solution:', solution);
            });
        }
        return embed;
    }
}
