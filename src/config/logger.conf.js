import { createLogger, format, transports } from "winston";
import { SERVER } from "./constants.conf.js";
import path from "path";
import fs from "fs";

const __dirname = path.resolve();

const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logger = createLogger({
    level: SERVER.isDev ? "debug" : "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        new transports.Console(),
        ...(SERVER.isDev
            ? []
            : [
                new transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
                new transports.File({ filename: path.join(logDir, "combined.log") }),
            ]),
    ],
});

export const specialLogger = (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const startTime = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - startTime;
        const message = `${req.method} ${req.originalUrl} | ${res.statusCode} | IP: ${ip} | Time: ${duration}ms | UA: ${req.headers["user-agent"]}`;
        const status = res.statusCode;

        status >= 400 ?
            logger.error(message) :
            logger.info(message);
    });

    next();
};

export default logger;
