import { DatabaseModel } from 'zumito-framework';

export class AdminUser extends DatabaseModel {
    getModel(schema: any) {
        // Return the model definition
        return {
            discordUserId: {
                type: schema.String,
                required: true,
                unique: true
            },
            username: {
                type: schema.String,
                required: false
            },
            isSuperAdmin: {
                type: schema.Boolean,
                default: false
            },
            createdAt: {
                type: schema.Date,
                required: true,
                default: () => new Date()
            }
        };
    }

    define(model: any, models: any): void {
        model.validatesUniquenessOf('discordUserId');
    }
}
