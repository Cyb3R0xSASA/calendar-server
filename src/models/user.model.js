import pkg from "mongoose";
const { Schema, model, models } = pkg;

import pkg2 from 'bcrypt'
const { hashSync, compareSync, genSaltSync } = pkg2;

const name = {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    match: [/^[A-Za-z]{2,20}$/],
}

const userSchema = new Schema(
    {
        firstName: { ...name },
        lastName: { ...name },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/]
        },
        password: {
            type: String,
            required: false,
            minlength: 8,
            maxlength: 100,
            match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:',.<>?/])[A-Za-z\d!@#$%^&*()_+\-=\[\]{}|;:',.<>?/]{8,100}$/]
        },
        profilePic: {
            type: String,
            default: "https://res.cloudinary.com/dor00xkct/image/upload/v1750174902/profile_pics/tz4x5cs88wdra0zzaubh.jpg",
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'publisher'],
            default: 'user',
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        oauthProviders: {
            type: Object,
            required: false,
            provider: { type: String, enum: ['google', 'x'], required: true },
            providerId: { type: String, required: true },
            email: { type: String },
        },
    },
    { timestamps: true }
);

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = hashSync(this.password, genSaltSync(10));
    next();
});

userSchema.methods.comparePassword = function (password) {
    return compareSync(password, this.password);
};

const User = models.User || model('User', userSchema);
export default User;