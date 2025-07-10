import { Types } from "mongoose";
import { sendError } from "./errorHandler.util.js";
import { HTTP_STATUS, SERVER } from "../config/constants.conf.js";

export const checkId = (req, res, next) => {
    const ID = req.params.id;
    if (!Types.ObjectId.isValid(ID))
        return sendError(
            res,
            SERVER.isDev ? `Route Not Found: ${req.method} ${req.originalUrl}` : 'Resource not found',
            'RESOURCE_NOT_FOUND',
            HTTP_STATUS.NOT_FOUND,
            'Invalid id, check it again.'
        );
    next();
};