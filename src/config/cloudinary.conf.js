import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY } from "./constants.conf.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: CLOUDINARY.NAME,
    api_key: CLOUDINARY.API_KEY,
    api_secret: CLOUDINARY.API_SECRET,
});

const allowedImagesFormats = ['jpg', 'jpeg', 'png', 'webp'];
export const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'profile_pics',
        allowed_formats: allowedImagesFormats,
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
});

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedMime = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (allowedMime.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPG, JPEG, PNG, and WEBP formats are allowed!'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

export default cloudinary;