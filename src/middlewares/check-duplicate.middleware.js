import { HTTP_STATUS } from "../config/constants.conf.js";
import { asyncError, sendError } from "../utils/errorHandler.util.js";
import cloudinary from "../config/cloudinary.conf.js";

const checkDuplicate = (unique, model, title, image = false, images = false) => asyncError(
    async (req, res, next) => {
        const exists = await model.exists({ [unique]: req.body[unique] });
        if (exists) {

            if (image) {
                const imageId = req.file.path.split(title)[1].split('.')[0]
                cloudinary.uploader.destroy(`${title}${imageId}`)
            };
            return sendError(
                res,
                `${title.toUpperCase()} already exist`,
                'ALREADY_EXIST',
                HTTP_STATUS.BAD_REQUEST,
                `${title.toUpperCase()} already exist in the database, rename ${unique} and try again later.`
            );
        }
        next();
    }
);

export default checkDuplicate;