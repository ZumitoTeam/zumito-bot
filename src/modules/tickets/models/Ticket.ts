import { DatabaseModel } from 'zumito-framework';
import { Snowflake } from 'discord.js';

export class Ticket extends DatabaseModel {
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
            channelId: {
                type: schema.String,
                required: true
            },
            createdAt: {
                type: schema.Date,
                required: true,
                default: () => new Date()
            },
            closedAt: {
                type: schema.Date,
                required: false
            },
            status: {
                type: schema.String,
                required: true,
                enum: ['open', 'closed'],
                default: 'open'
            }
        };
    }

    define(model: any, models: any): void {
        model.validatesPresenceOf('guildId', 'userId', 'channelId');
    }
}
