var chokidar = require('chokidar');
const path = require('path');
const { loadCommands } = require('@modules/utils/data.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const botConfig = require('@config/bot.js');
const chalk = require('chalk');
const emojis = require('@config/emojis.js');
require("@modules/localization.js");
const ErrorStackParser = require('error-stack-parser');

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
        if (/(?:^|(?<= ))(EmbedBuilder|Discord|ActionRowBuilder|ButtonBuilder|MessageSelectMenu)(?:(?= )|$) is not defined/gm.test(error.message)) {
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
        let embed = new EmbedBuilder()
            .setTitle(emojis.deny + ' ' + 'debug.error.title'.trans())
            .setColor(botConfig.embeds.color)
            .setDescription('debug.description'.trans())
            .setTimestamp()
            .addFields([{
                name: 'debug.command'.trans() + ':', 
                value: (error.comid.name || 'debug.not.defined'.trans())
            }])
            .addFields([{
                name: 'debug.arguments'.trans() + ':', 
                value: (error.args.toString() || 'debug.none'.trans())
            }])
            .addFields([{
                name: 'debug.error'.trans() + ':', 
                value: (error.name || 'debug.not.defined'.trans())
            }])
            .addFields([{
                name: 'debug.error.message'.trans() + ':', 
                value: (error.message || 'debug.not.defined'.trans())
            }]);
        if (error.possibleSolutions !== undefined) {
            error.possibleSolutions.forEach((solution) => {
                embed.addField([{
                    name: 'debug.solution'.trans() + ':', 
                    value: solution
                }]);
            });
        }

        let stackFrames = ErrorStackParser.parse(error).filter(e => !e.fileName.includes('node_modules') && !e.fileName.includes('node:internal'))
        let stack = '';
        stackFrames.forEach((frame) => {
            stack += `[${frame.fileName.replace(require('path').resolve('./'), '')}:${frame.lineNumber}](https://zumito.ga/redirect?url=vscode://file/${frame.fileName}:${frame.lineNumber}) ${frame.functionName}()\n`;
        });

        if (error.stack !== undefined) {
            embed.addFields([{
                name: 'debug.stack'.trans() + ':', 
                value: stack || error.stack || error.stack.toString() 
            }]);
        }
        if (error.details !== undefined) {
            error.details.forEach((detail) => {
                embed.addFields([{
                    name: 'debug.detail'.trans() + ':', 
                    value: detail
                }]);
            });
        }

        const body = `\n\n\n---\nComand:\`\`\`${error.comid.name || 'not defined'}\`\`\`\nArguments:\`\`\`${error.args.toString() || 'none'}\`\`\`\nError:\`\`\`${error.name || 'not defined'}\`\`\`\nError message:\`\`\`${error.message || 'not defined'}\`\`\`\n`;
        const url = `https://github.com/fernandomema/Zumito/issues/new?body=${encodeURIComponent(body)}`;

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('debug.button.report'.trans())
                    .setEmoji('975645505302437978')
                    .setURL(url)
            );
            
        return { 
            embeds: [embed], 
            components: [row], 
            allowedMentions: { 
                repliedUser: false 
            } 
        };
    }
}
