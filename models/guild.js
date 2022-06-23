var mongoose = require("mongoose");

const schema = new mongoose.Schema({ 
    id: 'string', 
    lang: {
        type: 'string',
        defalt: 'en'
    },
    prefix: {
        type: 'string',
        default: 'z-',
    },
    public: {
        type: 'boolean',
        default: false
    },
    deleteCommands: {
        type: 'boolean',
        default: false,
    },
    mutedUsers: {
        type: 'array',
    },
    modules: {
        cleanChannels: 'mixed',
        virtualCoin: {
            enabled: {
                type: 'boolean',
                default: false,
            },
            nameSingular: {
                type: 'string',
                default: 'Coin',
            },
            namePlural: {
                type: "string",
                default: "Coins",
            }
        }
    } 
});
module.exports = mongoose.model('Guild', schema);