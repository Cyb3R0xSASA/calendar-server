import { Router } from "express";
import passport from "passport";
import passportConfig from '../config/passport.conf.js';
import { createTokens } from "../utils/jwt.util.js";
import { SERVER } from "../config/constants.conf.js";
import { sendSuccess } from "../utils/errorHandler.util.js";

const router = Router();
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
        const { refreshToken, accessToken } = await createTokens(req, res, { id: req.user._id, role: req.user.role })
        sendSuccess(
            res,
            'User successfully login',
            {
                first_name: req.user.firstName,
                last_name: req.user.lastName,
                tokens: {
                    refresh_token: refreshToken,
                    access_token: accessToken
                }
            },
        );
    },
);

router.get('/x',
    passport.authenticate('oauth2', { scope: ['user.read', 'tweet.read'] })
)

router.get('/x/callback',
    passport.authenticate('oauth2', { session: false, failureRedirect: '/login' }),
    async (req, res) => {
        const { refreshToken, accessToken } = await createTokens(req, res, { id: req.user._id, role: req.user.role });
        sendSuccess(
            res,
            'User successfully login',
            {
                user: {
                    first_name: req.user.firstName,
                    last_name: req.user.lastName,
                },
                tokens: {
                    refresh_token: refreshToken,
                    access_token: accessToken
                }
            },
        );
    },
);

export default router;