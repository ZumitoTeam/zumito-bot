import { DatabaseModel } from 'zumito-framework';

export class ConfessionConfig extends DatabaseModel {
    getModel(schema: any) {
        return {
            guildId: { type: schema.String, required: true, unique: true },
            channelId: { type: schema.String, required: true }
        };
    }

    define(model: any): void {
        model.validatesUniquenessOf('guildId');
    }
}
