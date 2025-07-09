import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import User from "../models/user.model.js";
import { OAUTH } from "./constants.conf.js";
import logger from "./logger.conf.js";

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: OAUTH.GOOGLE_CLIENT_ID,
            clientSecret: OAUTH.GOOGLE_CLIENT_SECRET,
            callbackURL: OAUTH.GOOGLE_CALLBACK,
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ 'oauthProviders.providerId': profile.id });
                if (!user) {
                    const provider = { provider: 'google', providerId: profile.id, email: profile.emails[0].value }
                    logger.info(`profile: ${profile}`)
                    user = await User.findOne({ email: profile.emails[0].value });
                    if (user) {
                        user.oauthProviders = provider;
                        await user.save();
                    } else {
                        user = await User.create({
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile.emails[0].value,
                            isEmailVerified: true,
                            oauthProviders: provider,
                        });
                    }
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.use(
    new OAuth2Strategy(
        {
            clientID: OAUTH.X_CLIENT_ID,
            clientSecret: OAUTH.X_CLIENT_SECRET,
            callbackURL: OAUTH.X_CALLBACK,
            scope: ['user.read', 'tweet.read'],
            authorizationURL: 'https://api.x.com/2/oauth2/authorize',
            tokenURL: 'https://api.x.com/2/oauth2/token',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const response = await fetch('https://api.x.com/2/users/me', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const xProfile = await response.json();
                logger.info(`xProfile: ${xProfile} | profile: ${profile}`);
                const providerData = {
                    provider: 'x',
                    providerId: xProfile.data.id,
                };
                let user = await User.findOne({ "oauthProviders.providerId": xProfile.data.id, });

                if (!user)
                    user = await User.create({
                        firstName: xProfile.data.name.split(" ")[0],
                        lastName: xProfile.data.name.split(" ").slice(1).join(" "),
                        email: null,
                        isEmailVerified: true,
                        oauthProviders: providerData,
                    });
                return done(null, user);
            } catch (error) {
                return done(error, null)
            }
        }
    )
);

export default passport;