import pkg from 'mongoose';
import { constants } from './category.model.js';
const { models, model, Schema } = pkg;

const termSchema = new Schema(
    {
        name: { ...constants.title },
        startDate: { ...constants.date },
        endDate: { ...constants.date },
    },
    { timestamps: true },
);

export const Term = models.Term || model('Term', termSchema);