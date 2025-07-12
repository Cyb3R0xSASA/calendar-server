import { HTTP_STATUS } from "../config/constants.conf.js";
import { sendError } from "./errorHandler.util.js";

export const noItem = (res, title, item, len = 1) => {
    if (!item || !len) {
        sendError(
            res,
            `There's no ${title} now, try again later`,
            'NOT_FOUND',
            HTTP_STATUS.NOT_FOUND,
            len ? `There's no ${title} now, please create them at first`
                : `Check the ${title} id at first and retry again`,

        );
        return true;
    }
    else {
        return false;
    }
}