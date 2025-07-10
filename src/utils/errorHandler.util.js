import { SERVER, HTTP_STATUS } from "../config/constants.conf.js";

export const sendSuccess = (
    res,
    message,
    data = undefined,
    statusCode = HTTP_STATUS.OK
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const sendError = (
    res,
    message,
    errorCode = 'UNKNOWN_ERROR',
    statusCode = HTTP_STATUS.BAD_REQUEST,
    errors = [],
) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errorCode,
        ...(SERVER.isDev && errors.length ? { errors } : {}),
    });
};

export const asyncError = (asyncFn) => (req, res, next) =>
    asyncFn(req, res, next).catch(error => next(error));

export const responseError = (error, req, res, next) => {
    const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal Server Error";
    const data = error.data || [];

    return sendError(res, message, 'UNKNOWN_ERROR', statusCode, data);
};

export const routeError = (req, res, next) =>
    sendError(
        res,
        SERVER.isDev ? `Route Not Found: ${req.method} ${req.originalUrl}` : 'Resource not found',
        'RESOURCE_NOT_FOUND',
        HTTP_STATUS.NOT_FOUND,
        [`${req.method} ${req.originalUrl}`]
    );
