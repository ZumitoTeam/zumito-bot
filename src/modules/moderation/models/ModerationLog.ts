import { DatabaseModel } from 'zumito-framework';

export class ModerationLog extends DatabaseModel {
    getModel(schema: any) {
        return {
            guildId: {
                type: schema.String,
                required: true
            },
            targetId: {
                type: schema.String,
                required: true
            },
            moderatorId: {
                type: schema.String,
                required: true
            },
            action: {
                type: schema.String, // 'ban', 'kick', 'warn'
                required: true
            },
            reason: {
                type: schema.String,
                required: false
            },
            date: {
                type: schema.Date,
                required: true,
                default: () => new Date()
            }
        };
    }

    define(model: any, models: any): void {
        // Optionally add indexes or validations here
    }
}
