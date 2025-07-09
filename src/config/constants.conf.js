import 'dotenv/config';
import { renderFile } from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

export const SERVER = {
    PORT: process.env.PORT,
    HOST: process.env.HOST,
    isDev: process.env.NODE_ENV === 'development',
};

export const DATA = {
    DATABASE_URI: process.env.DATABASE_URI,
    REDIS_URL: process.env.REDIS_URL,
};

export const JWT = {
    SECRET_KEY: process.env.JWT_SECRET_KEY,
    SECRET_KEY_EXPIRES_IN: process.env.JWT_SECRET_KEY_EXPIRES_IN,
    REFRESH_KEY: process.env.JWT_REFRESH_KEY,
    REFRESH_KEY_EXPIRES_IN: process.env.JWT_REFRESH_KEY_EXPIRES_IN,
};

export const SMTP = {
    USER: process.env.SMTP_USER,
    PASSWORD: process.env.SMTP_PASSWORD,
    HOST: process.env.SMTP_HOST,
    PORT: process.env.SMTP_PORT,
};

export const CLOUDINARY = {
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
    NAME: process.env.CLOUDINARY_NAME,
};

export const CLIENT_SERVER = process.env.CLIENT_SERVER;

export const OAUTH = {
    GOOGLE_CLIENT_ID: process.env.OAUTH_GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK: process.env.OAUTH_GOOGLE_CALLBACK,
    FACEBOOK_CLIENT_ID: process.env.OAUTH_FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.OAUTH_FACEBOOK_CLIENT_SECRET,
    X_CLIENT_ID: process.env.OAUTH_X_CLIENT_ID,
    X_CLIENT_SECRET: process.env.OAUTH_X_CLIENT_SECRET,
    X_CALLBACK: process.env.OAUTH_X_CALLBACK,
    APPLE_CLIENT_ID: process.env.OAUTH_APPLE_CLIENT_ID,
    APPLE_CLIENT_SECRET: process.env.OAUTH_APPLE_CLIENT_SECRET,
}

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    LIMIT_REQUESTS: 429,
    

    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};

export const OTP_CONF = {
    MAX_OTP_PER_DAY: 20,
    OTP_TTL_SECONDS: 600,
    COOL_DOWN_SECONDS: 60,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.join(__dirname, '../docs/email.ejs');
export const subjects = {
    verify: 'Verify Your Email',
    reset: 'Reset Your Password',
};
const headers = {
    verify: 'Email Verification',
    reset: 'Resting Password',
};
const paragraphs = {
    verify: 'Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email:',
    reset: 'Please use the following One-Time Password (OTP) to reset your password:'
};
export const HTML = async (statusType, firstName, lastName, otp) => {
    return await renderFile(templatePath, {
        subject: subjects[statusType],
        header: headers[statusType],
        firstName,
        lastName,
        paragraph: paragraphs[statusType],
        otp
    })
}