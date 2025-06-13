import { DatabaseModel } from 'zumito-framework';

export class Poll extends DatabaseModel {
    getModel(schema: any) {
        return {
            guildId: { type: schema.String, required: true },
            channelId: { type: schema.String, required: true },
            messageId: { type: schema.String, required: true },
            authorId: { type: schema.String, required: true },
            question: { type: schema.String, required: true },
            options: { type: [schema.String], required: true },
            votes: { type: schema.Mixed, required: false, default: () => ({}) },
            ended: { type: schema.Boolean, required: true, default: false },
            createdAt: { type: schema.Date, required: true, default: () => new Date() },
        };
    }

    define(model: any, models: any): void {
        model.validatesPresenceOf('guildId', 'channelId', 'messageId', 'authorId', 'question');
    }
}
