import { Types } from "mongoose";
import { sendError } from "./errorHandler.util.js";
import { HTTP_STATUS } from "../config/constants.conf.js";

export const checkId = (req, res, next) => {
    const ID = req.params.id;
    if (!Types.ObjectId.isValid(ID))
        return sendError(
            res,
            'Invalid resource id.',
            'INVALID_ID',
            HTTP_STATUS.BAD_REQUEST,
            'Invalid id, check it again.'
        );
    next();
};