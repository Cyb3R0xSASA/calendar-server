import pkg from 'mongoose';
import { constants } from './category.model.js';
const { models, model, Schema, Types } = pkg;

export const groups = ['all', 'activity_leader', 'student_advisor', 'health_advisor', 'teacher', 'school_principal', 'parent', 'student']

const eventSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: constants.title({ unique: true }),
    description: {
        type: String,
        minlength: 10,
        maxlength: 1500,
    },
    date: { ...constants.date },
    categories: [{
        type: Types.ObjectId,
        ref: 'Category',
    }],
    targetGroups: [{
        type: String,
        enum: groups,
        default: groups[0],
    }],
    banner: constants.banner,
});

export const Event = models.Event || model('Event', eventSchema)