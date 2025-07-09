import { Types } from "mongoose";
import { HTTP_STATUS } from "../config/constants.conf.js";
import User from "../models/user.model.js";
import { asyncError, sendError } from "../utils/errorHandler.util.js";
import { verifyAccessToken } from "../utils/jwt.util.js";

export const protectRoute = asyncError(
    async (req, res, next) => {
        const token = req?.cookies?.access_token;
        const error = () => sendError(
            res,
            'You should login at first',
            'UNAUTHORIZED_USER',
            HTTP_STATUS.UNAUTHORIZED,
            'User not allowed to use this endpoint need to login before use it.'
        );

        if (!token)
            return error()
        const decoded = verifyAccessToken(token);
        if (!decoded)
            return error();
        req.user = decoded;
        next();
    }
);

export const role = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return sendError(
                res,
                'You should be authorized',
                'UNAUTHORIZED_USER',
                HTTP_STATUS.UNAUTHORIZED,
                'User not allowed to use this endpoint need to login before use it.'
            );

        next();
    }
};