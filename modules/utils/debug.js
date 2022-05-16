var chokidar = require('chokidar');
const path = require('path');
const { loadCommands } = require('@modules/utils/data.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const botConfig = require('@config/bot.js');
const chalk = require('chalk');
const emoji =require('@config/emojis.js');
require("@modules/localization.js");

module.exports = {
    initializeDebug(client) {
        module.exports.client = client;
        this.watcher = chokidar.watch(path.resolve(__dirname + '/../../commands'), { ignored: /^\./, persistent: true, ignoreInitial: true })
            .on('add', module.exports.onAdd)
            .on('change', module.exports.onChange)
            //.on('unlink', function(path) {console.log('File', path, 'has been removed');})
            .on('error', module.exports.onError);
    },

    onChange(file) {
        console.debug('[🔄 ] Command ' + chalk.blue(file.replace(/^.*[\\\/]/, '').split('.').slice(0, -1).join('.')) + ' reloaded');
        loadCommands(module.exports.client, path.resolve(__dirname + '/../../commands'));
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
            .setTitle(emoji.deny + ' ' + 'debug.error.title'.trans())
            .setColor(botConfig.embeds.color)
            .setDescription('debug.description'.trans())
            .setTimestamp()
            .addField('debug.command'.trans() + ':', (error.comid.name || 'debug.not.defined'.trans()))
            .addField('debug.arguments'.trans() + ':', (error.args.toString() || 'debug.none'.trans()))
            .addField('debug.error'.trans() + ':', (error.name || 'debug.not.defined'.trans()))
            .addField('debug.error.message'.trans() + ':', (error.message || 'debug.not.defined'.trans()));
        if (error.possibleSolutions !== undefined) {
            error.possibleSolutions.forEach((solution) => {
                embed.addField('debug.solution'.trans() + ':', solution);
            });
        }
        if (error.stack !== undefined) {
            embed.addField('debug.stack'.trans() + ':', error.stack || error.stack.toString());
        }
        if (error.details !== undefined) {
            error.details.forEach((detail) => {
                embed.addField('debug.detail'.trans() + ':', detail);
            });
        }

        const body = `\n\n\n---\nComand:\`\`\`${error.comid.name || 'not defined'}\`\`\`\nArguments:\`\`\`${error.args.toString() || 'none'}\`\`\`\nError:\`\`\`${error.name || 'not defined'}\`\`\`\nError message:\`\`\`${error.message || 'not defined'}\`\`\`\n`;
        const url = `https://github.com/fernandomema/Zumito/issues/new?body=${encodeURIComponent(body)}`;

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setLabel('debug.button.report'.trans())
                    .setEmoji('975645505302437978')
                    .setURL(url)
            );



        return { embeds: [embed], components: [row], allowedMentions: { repliedUser: false } };
    }
}
