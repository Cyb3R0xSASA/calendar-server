import { HTTP_STATUS } from "../config/constants.conf.js";
import logger from "../config/logger.conf.js";
import { sendError } from "./errorHandler.util.js";

export const validateBody = (schema) => {
    return (req, res, next) => {
        if (!req.body || !Object.keys(req.body))
            return sendError(
                res,
                'Request data is missing',
                'NO_DATA',
                HTTP_STATUS.BAD_REQUEST,
                'Body is empty',
            );
        const { error } = schema.validate(req.body)
        if (error)
            return sendError(
                res,
                'Request data is missing',
                'MISSED_DATA',
                HTTP_STATUS.BAD_REQUEST,
                error.details.map(message => message.message.replaceAll('"', ''))
            );
        next();
    }
}