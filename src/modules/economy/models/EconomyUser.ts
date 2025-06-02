import { DatabaseModel } from 'zumito-framework';

export class EconomyUser extends DatabaseModel {
    getModel(schema: any) {
        return {
            userId: {
                type: schema.String,
                required: true
            },
            free: {
                type: schema.Number,
                required: true,
                default: 0
            },
            paid: {
                type: schema.Number,
                required: true,
                default: 0
            },
            guilds: {
                type: schema.Mixed, // { [guildId]: { balance: number } }
                required: false,
                default: () => ({})
            }
        };
    }

    define(model: any, models: any): void {
        model.validatesUniquenessOf('userId');
    }
}
