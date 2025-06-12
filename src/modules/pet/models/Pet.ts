import { DatabaseModel } from 'zumito-framework';

export class Pet extends DatabaseModel {
    getModel(schema: any) {
        return {
            userId: { type: schema.String, required: true, unique: true },
            hunger: { type: schema.Number, required: true, default: 100 },
            happiness: { type: schema.Number, required: true, default: 100 },
            lastUpdated: { type: schema.Date, required: true, default: () => new Date() },
        };
    }

    define(model: any, models: any): void {
        model.validatesUniquenessOf('userId');
    }
}
