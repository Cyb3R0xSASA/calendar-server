import { createLogger, format, transports } from "winston";
import { SERVER } from "./constants.conf.js";
import path from 'path';

const __dirname = path.resolve();

const logger = createLogger({
    level: SERVER.isDev ? 'debug' : 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`),
    ),
    transports: [
        new transports.Console(),
        ...(SERVER.isDev
            ? []
            : [
                new transports.File({ filename: path.join(__dirname, 'logs/error.log'), level: 'error' }),
                new transports.File({ filename: path.join(__dirname, 'logs/combined.log') }),
            ]
        ),
    ],
});

export default logger;