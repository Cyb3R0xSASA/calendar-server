import pkg from 'mongoose';
const { Schema, model, models, Types } = pkg;

const sessionSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },
        refreshToken: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true
        },
        blocked: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true },
);

const Session = models.Session || model('Session', sessionSchema);
export default Session;