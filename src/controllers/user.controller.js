import cloudinary from "../config/cloudinary.conf.js";
import { HTTP_STATUS } from "../config/constants.conf.js";
import User from "../models/user.model.js";
import { asyncError, sendError, sendSuccess } from "../utils/errorHandler.util.js";

const me = asyncError(
    async (req, res, next) => {
        const user = await User.findById(req.user.userId);
        return sendSuccess(
            res,
            'Successfully retrieve user details',
            {
                user: {
                    first_name: user.firstName,
                    last_name: user.lastName,
                    email: user.email
                }
            },
            HTTP_STATUS.OK
        )
    }
);

const changePassword = asyncError(
    async (req, res, next) => {
        const { password, old_password } = req.body;
        const user = await User.findById(req.user.userId);
        const isMatchPassword = user.comparePassword(old_password);
        if (!isMatchPassword)
            return sendError(
                res,
                'Old password not correct.',
                'NOT_CORRECT',
                HTTP_STATUS.BAD_REQUEST,
                'Old password not correct, check it first to enable to change it.'
            );
        user.password = password;
        await user.save();
        return sendSuccess(
            res,
            'Password changed successfully.',
            undefined,
            HTTP_STATUS.OK
        );
    }
);

const profilePicture = asyncError(
    async (req, res, next) => {
        if (!req.file || !req.file.path)
            return sendError(
                res,
                'Image upload failed',
                'UPLOAD_FAILED',
                HTTP_STATUS.BAD_REQUEST,
                'No file or Cloudinary path returned'
            );

        const imageUrl = req.file.path;
        const { profilePic } = await User.findById(req.user.userId);
        const oldImage = profilePic.split('profile_pics')[1].split('.')[0];
        const isMatch = oldImage === '/tz4x5cs88wdra0zzaubh';

        if (!isMatch)
            cloudinary.uploader.destroy(`profile_pics${oldImage}`);
        await User.updateOne({ _id: req.user.userId }, { profilePic: imageUrl });
        return sendSuccess(
            res,
            'Successfully update profile picture.',
            undefined,
            HTTP_STATUS.OK
        );
    }
);

const users = asyncError(
    async (req, res, next) => {
        const users = await User.find().select('-password -_id -isEmailVerified -__v');
        return sendSuccess(
            res,
            'Successfully fetch users',
            { users },
            HTTP_STATUS.OK
        )
    }
);

const changeRole = asyncError(
    async (req, res, next) => {
        const { role } = req.body;
        await User.updateOne({ _id: req.params.id }, { role })
        return sendSuccess(
            res,
            'Successfully update the role of the user',
            undefined,
            HTTP_STATUS.OK,
        )
    }
);

const deleteUser = asyncError(
    async (req, res, next) => {
        const user = User.findById(req.params.id);
        if (!user)
            return sendError(
                res,
                'User not exist, check the id and try again.',
                "NOT_CORRECT",
                HTTP_STATUS.BAD_REQUEST,
                'User id not correct check it at first',
            );

        await User.deleteOne({ _id: req.params.id });
        sendSuccess(
            res,
            'User was deleted successfully.',
            undefined,
            HTTP_STATUS.OK
        )
    }
);

export const userController = {
    users,
    me,
    changePassword,
    profilePicture,
    changeRole,
    deleteUser
};