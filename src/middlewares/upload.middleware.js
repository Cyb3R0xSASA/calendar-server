import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { validateMultipleImages, validateSingleImage } from "../middlewares/validations/image.validation.js";
import cloudinary from "../config/cloudinary.conf.js";

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const storage = (folder) => new CloudinaryStorage({
    cloudinary,
    params: {
        folder,
        allowed_formats: allowedMimeTypes.map(ext => ext.split('/')[1]),
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
});

export const upload = (folder) => multer({
    storage: storage(folder),
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPG, JPEG, PNG, and WEBP formats are allowed!'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export const uploadImage = (folder, fieldName = 'image') => [
    upload(folder).single(fieldName),
    validateSingleImage,
];

export const uploadImages = (folder, fieldName = 'images', maxCount = 5) => [
    upload(folder).array(fieldName, maxCount),
    validateMultipleImages,
];

