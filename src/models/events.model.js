import pkg from 'mongoose';
import { constants } from './category.model.js';
const { models, model, Schema, Types } = pkg;

const eventSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ...constants.title,
    description: {
        type: String,
        minlength: 10,
        maxlength: 1500,
    },
    date: { ...constants.date },
    repeatRule: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly'],
        default: 'none',
    },
    dayOfWeek: {
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        default: null,
    },
    categories: [{
        type: Types.ObjectId,
        ref: 'Category',
    }],
    targetGroups: [{
        type: String,
        enum: ['activity_leader', 'student_advisor', 'health_advisor', 'teacher', 'school_principal', 'parent', 'student'],
    }],
    ...constants.banner,
    products: [{
        ...constants.banner,
        title: { ...constants.title },
        enabled: { type: Boolean, default: true },
    }],
});

const Event = models.Event || model('Event', eventSchema)