import { DatabaseModel } from 'zumito-framework';

export class Guild extends DatabaseModel {
    getModel(schema: any) {
        return {
            moderation_warns_channel: {
                type: schema.String,
                required: false,
                default: null
            },
            moderation_bans_channel: {
                type: schema.String,
                required: false,
                default: null
            },
            moderation_kicks_channel: {
                type: schema.String,
                required: false,
                default: null
            },

            moderation_warn_embed: {
                type: schema.string,
                required: false,
                default: null
            },
            moderation_ban_embed: {
                type: schema.string,
                required: false,
                default: null
            },
            moderation_kick_embed: {
                type: schema.string,
                required: false,
                default: null
            },
        };
    }

    define(model: any, models: any): void {
        // Optionally add indexes or validations here
    }
}
