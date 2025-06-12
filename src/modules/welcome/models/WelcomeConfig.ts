import { DatabaseModel } from 'zumito-framework';

export class WelcomeConfig extends DatabaseModel {
    getModel(schema: any) {
        return {
            guildId: {
                type: schema.String,
                required: true,
                unique: true
            },
            channelId: {
                type: schema.String,
                required: true
            },
            message: {
                type: schema.String,
                required: true,
                default: 'Welcome {user}!'
            }
        };
    }

    define(model: any, models: any): void {
        model.validatesUniquenessOf('guildId');
    }
}
