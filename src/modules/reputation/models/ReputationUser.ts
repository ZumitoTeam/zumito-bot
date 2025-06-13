import { DatabaseModel } from 'zumito-framework';

export class ReputationUser extends DatabaseModel {
    getModel(schema: any) {
        return {
            userId: {
                type: schema.String,
                required: true,
            },
            reputation: {
                type: schema.Number,
                required: true,
                default: 0,
            },
        };
    }

    define(model: any, models: any): void {
        model.validatesUniquenessOf('userId');
    }
}
