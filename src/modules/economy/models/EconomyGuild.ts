import { DatabaseModel } from 'zumito-framework';

export class EconomyGuild extends DatabaseModel {
    getModel(schema: any) {
        return {
            guildId: {
                type: schema.String,
                required: true
            },
            currencyName: {
                type: schema.String,
                required: true,
                default: 'Coins'
            }
        };
    }

    define(model: any, models: any): void {
        model.validatesUniquenessOf('guildId');
    }
}
