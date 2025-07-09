import { connect } from "mongoose";
import { DATA } from "./constants.conf.js";
import logger from "./logger.conf.js";

export const connectDB = async () => {
    try {
        const conn = await connect(DATA.DATABASE_URI);
        logger.info(`MongoDB connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`MongoDB connecting error: ${error}`);
        process.exit(0);
    }
};