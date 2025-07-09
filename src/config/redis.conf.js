import Redis from "ioredis";
import { DATA } from "./constants.conf.js";
import logger from "./logger.conf.js";

export const redis = new Redis(DATA.REDIS_URL);

redis.on('connect', () => logger.info('Redis connected successfully'));
redis.on('error', (error) => logger.error(`Redis connected error: ${error}`));