import { HTTP_STATUS } from "../config/constants.conf.js";
import User from "../models/user.model.js";
import { destroyEmailOTP, limitOtpTrying, otpGenerator, sendingOTP } from "../utils/email/otp.js";
import { asyncError, sendError, sendSuccess } from "../utils/errorHandler.util.js";
import { redis } from "../config/redis.conf.js";
import { createTokens, generateAccessToken, setTokensCookie, verifyAndRotateRefreshToken, verifyRefreshToken } from "../utils/jwt.util.js";

const register = asyncError(
    async (req, res, next) => {
        const { firstName, lastName, email, password } = req.body;
        const isUser = await User.findOne({ email });

        if (isUser)
            return sendError(
                res,
                'User exist already',
                'USER_EXIST',
                HTTP_STATUS.FORBIDDEN,
                'User already exist in the database'
            );
        const newUser = new User({ firstName, lastName, email, password });
        await otpGenerator(newUser, 'verify');
        await newUser.save();
        console.log('first');
        sendSuccess(
            res,
            'User created successfully',
            {
                first_name: newUser.firstName,
                last_name: newUser.lastName,
                email: newUser.email,
            },
            HTTP_STATUS.CREATED,
        );
    }
);

const verifyEmail = asyncError(
    async (req, res, next) => {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return sendError(
                res,
                'Resource Not Exist',
                'NOT_EXIST',
                HTTP_STATUS.BAD_REQUEST,
                'You must register first to verify your email.',
            );
        if (user.isEmailVerified)
            return sendError(
                res,
                'Email already verified.',
                'EMAIL_VERIFIED',
                HTTP_STATUS.BAD_REQUEST,
                'Email already in database and verified.'
            );

        await limitOtpTrying({ pre: 'verified', sub: 'verify' }, user, res, otp)
        await User.updateOne({ email }, { isEmailVerified: true });
        await destroyEmailOTP('verify', user._id);
        sendSuccess(
            res,
            'Email verified successfully.',
            undefined,
            HTTP_STATUS.OK,
        );
    }
);

const resendVerifyOtp = asyncError(
    async (req, res, next) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return sendError(
                res,
                'Resource Not Exist',
                'NOT_EXIST',
                HTTP_STATUS.BAD_REQUEST,
                'You must register first to verify your email.',
            );
        if (user.isEmailVerified)
            return sendError(
                res,
                'Resource Not Exist',
                'NOT_EXIST',
                HTTP_STATUS.BAD_REQUEST,
                'You email already verified, not ask for a new otp.',
            );

        await sendingOTP(user, { pre: 'verified', sub: 'verify' }, res);
    }
);

const login = asyncError(
    async (req, res, next) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user?.isEmailVerified)
            return sendError(
                res,
                'Email or Password not correct, try again later.',
                'LOGIN_FAILED',
                HTTP_STATUS.BAD_REQUEST,
                'You must register first, then verify, then login not login before them.',
            );
        const passwordMatch = user.comparePassword(password);
        if (!passwordMatch)
            return sendError(
                res,
                'Email or Password not correct, try again later.',
                'LOGIN_FAILED',
                HTTP_STATUS.BAD_REQUEST,
                'User email or password not correct check them and login again.',
            );

        const { accessToken, refreshToken } = await createTokens(req, res, { id: user._id, role: user.role });
        sendSuccess(
            res,
            'User login correctly',
            {
                user: {
                    first_name: user.firstName,
                    last_name: user.lastName,
                },
                access_token: accessToken,
                refresh_token: refreshToken,
            },
            HTTP_STATUS.OK,
        );
    }
);

const forgotPassword = asyncError(
    async (req, res, next) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isEmailVerified)
            return sendError(
                res,
                'Resource Not Exist',
                'NOT_EXIST',
                HTTP_STATUS.BAD_REQUEST,
                'You must register first to reset your password.',
            );
        await sendingOTP(user, { pre: 'rested', sub: 'reset' }, res);
    }
);

const resetPassword = asyncError(
    async (req, res, next) => {
        const { email, otp, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isEmailVerified)
            return sendError(
                res,
                'Resource Not Exist',
                'NOT_EXIST',
                HTTP_STATUS.BAD_REQUEST,
                'You must register first to verify your email.',
            );
        const tries = await limitOtpTrying({ pre: 'reset', sub: 'reset' }, user, res, otp)
        if (!tries) return;
        user.password = password;
        await user.save();
        await destroyEmailOTP('reset', user._id);
        sendSuccess(
            res,
            'Email rested successfully.',
            undefined,
            HTTP_STATUS.OK,
        );
    }
);

const logout = asyncError(
    async (req, res, next) => {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken)
            return sendError(
                res,
                'Resource Not Exist',
                'NOT_EXIST',
                HTTP_STATUS.CONFLICT,
                'Now access token provided',
            );
        await verifyAndRotateRefreshToken(refreshToken)
        res.clearCookie('refresh_token');
        res.clearCookie('access_token');

        return sendSuccess(
            res,
            'Logout successfully.',
            undefined,
            HTTP_STATUS.OK
        );
    }
);

const deleteMe = asyncError(
    async (req, res, next) => {
        await User.findByIdAndDelete(req.user.userId);
        res.clearCookie('refresh_token');
        res.clearCookie('access_token');
        sendSuccess(
            res,
            'Deleted successfully',
            undefined,
            HTTP_STATUS.OK
        )
    }
);

const refreshToken = asyncError(
    async (req, res, next) => {
        const refreshToken = req.cookies.refresh_token;
        const err = () => sendError(
            res,
            'You should login at first',
            'UNAUTHORIZED_USER',
            HTTP_STATUS.UNAUTHORIZED,
            'User not allowed to use this endpoint need to login before use it.'
        );

        if (!refreshToken) return err();

        const decode = verifyRefreshToken(refreshToken);
        if (!decode) return err();

        const isExist = await redis.get(`refresh_token:${decode.userId}:${decode.jti}`);
        if (!isExist) return err();
        const accessToken = generateAccessToken({ userId: decode.userId, role: decode.role });
        setTokensCookie(res, accessToken);
        return sendSuccess(
            res,
            'Successfully refresh token',
            { access_token: accessToken },
            HTTP_STATUS.OK
        );
    }
);

export const authController = {
    register,
    verifyEmail,
    resendVerifyOtp,
    login,
    forgotPassword,
    resetPassword,
    logout,
    refreshToken,
    deleteMe,
}