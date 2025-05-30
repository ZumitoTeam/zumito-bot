import { DatabaseModel } from 'zumito-framework';

export class RankUser extends DatabaseModel {
    getModel(schema: any) {
        return {
            guildId: {
                type: schema.String,
                required: true
            },
            userId: {
                type: schema.String,
                required: true
            },
            xp: {
                type: schema.Number,
                required: true,
                default: 0
            },
            level: {
                type: schema.Number,
                required: true,
                default: 1
            },
            lastMessage: {
                type: schema.Date,
                required: false
            }
        };
    }

    define(model: any, models: any): void {
        model.validatesUniquenessOf('guildId', 'userId');
    }
}
