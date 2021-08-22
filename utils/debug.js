var chokidar = require('chokidar');
const path = require('path');
const {loadCommands} = require('../utils/data.js');

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
        console.debug('Updated ' + file + ' command');
        loadCommands(module.exports.client, path.resolve(__dirname + '/../commands'));
    },

    onAdd(file) {
        console.debug('Added ' + file + ' command');
        //loadCommands(module.exports.client, path.resolve(__dirname + '/../commands'));
    },

    onError(error) {
        console.error(error);
    }
}
