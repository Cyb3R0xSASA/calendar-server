import { HTTP_STATUS } from "../../config/constants.conf.js";
import { sendError } from "../../utils/errorHandler.util.js";

export const validateSingleImage = (req, res, next) => {
    if (!req.file || !req.file.path) {
        return sendError(
            res,
            'Image upload failed',
            'UPLOAD_FAILED',
            HTTP_STATUS.BAD_REQUEST,
            'No file or Cloudinary path returned'
        );
    }
    next();
};

export const validateMultipleImages = (req, res, next) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return sendError(
            res,
            'Image upload failed',
            'UPLOAD_FAILED',
            HTTP_STATUS.BAD_REQUEST,
            'No files or Cloudinary paths returned'
        );
    }
    const missing = req.files.filter(f => !f.path);
    if (missing.length > 0) {
        return sendError(
            res,
            'Some images failed to upload',
            'PARTIAL_UPLOAD_FAILED',
            HTTP_STATUS.BAD_REQUEST,
            'One or more uploaded files have no Cloudinary path'
        );
    }
    next();
};