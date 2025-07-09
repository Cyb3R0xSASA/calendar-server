import pkg from 'jsonwebtoken';
import ms from "ms";
import { JWT, SERVER } from "../config/constants.conf.js";
import { redis } from '../config/redis.conf.js';
import { randomUUID } from 'crypto'
import { sendError } from './errorHandler.util.js';

const { sign, verify, decode } = pkg;
export const generateAccessToken = (payload) =>
    sign(payload, JWT.SECRET_KEY, { expiresIn: JWT.SECRET_KEY_EXPIRES_IN });

export const generateRefreshToken = (payload) => {
    const jti = randomUUID()
    return sign({ ...payload, jti }, JWT.REFRESH_KEY, { expiresIn: JWT.REFRESH_KEY_EXPIRES_IN });
}

export const setTokensCookie = (res, access, refresh) => {
    if (access)
        res.cookie('access_token', access, {
            httpOnly: true,
            secure: !SERVER.isDev,
            sameSite: 'Strict',
            maxAge: ms(JWT.SECRET_KEY_EXPIRES_IN),
        });

    if (refresh)
        res.cookie('refresh_token', refresh, {
            httpOnly: true,
            secure: !SERVER.isDev,
            sameSite: 'Strict',
            maxAge: ms(JWT.REFRESH_KEY_EXPIRES_IN),
        });
};

const verifyToken = (token, secret) => {
    try {
        return verify(token, secret);
    } catch (error) {
        return false
    }
};

export const verifyAccessToken = (token) =>
    verifyToken(token, JWT.SECRET_KEY);


export const verifyRefreshToken = (token) =>
    verifyToken(token, JWT.REFRESH_KEY);

export const storeRefreshToken = async (userId, token, ip) => {
    const { jti, exp } = decode(token);
    const key = `refresh_token:${userId}:${jti}`;
    const ttlSeconds = exp - Math.floor(Date.now() / 1000);

    await redis.set(key, token, 'EX', ttlSeconds);
    console.log('first')
    const metaKey = `refresh_meta:${userId}:${jti}`;
    await redis.hset(metaKey, {
        ip,
        issuedAt: new Date().toISOString(),
    });
    await redis.expire(metaKey, ttlSeconds);
};

export const verifyAndRotateRefreshToken = async (token) => {
    const payload = verifyRefreshToken(token);
    const { userId, jti } = payload;

    const key = `refresh_token:${userId}:${jti}`;
    const isKeyExist = await redis.get(key);
    if (!isKeyExist)
        return sendError(
            res,
            '',
            '',
            HTTP_STATUS.CONFLICT,
            'Now access token provided',
        );

    await redis.del(key);
    await redis.del(`refresh_meta:${userId}:${jti}`);
};

export const createTokens = async (req, res, {id, role}) => {
    const ip = req.ip;
    const payload = { userId: id, role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    setTokensCookie(res, accessToken, refreshToken);
    await storeRefreshToken(id, refreshToken, ip || 'unknown');
    return { accessToken, refreshToken }
};