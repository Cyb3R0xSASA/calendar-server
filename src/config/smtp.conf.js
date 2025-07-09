import { createTransport } from "nodemailer";
import { SMTP } from "./constants.conf.js";
import logger from "./logger.conf.js";

export const transporter = createTransport({
    auth: {
        user: SMTP.USER,
        pass: SMTP.PASSWORD,
    },
    host: SMTP.HOST,
    port: SMTP.PORT,
});

transporter.verify((error) => {
    if (error)
        logger.error(`Email transporter error: ${error}`);
    else
        logger.info(`Email transporter configured successfully`);
});

export default transporter