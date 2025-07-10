import pkg from 'mongoose';
const { models, model, Schema } = pkg;

export const constants = {
    title: (extra = {}) => ({
        type: String,
        minlength: 2,
        maxlength: 50,
        required: true,
        trim: true,
        ...extra,
    }),
    date: {
        type: Date,
        required: true,
    },
    banner: {
        image: { type: String },
        url: { type: String },
    }
}

const categorySchema = new Schema(
    {
        title: constants.title({ unique: true }),
    },
    { timestamps: true }
);

export const Category = models.Category || model('Category', categorySchema);