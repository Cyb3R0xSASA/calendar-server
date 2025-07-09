import e from "express";
import swaggerUi from 'swagger-ui-express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import morgan from "morgan";

import swaggerDoc from "./src/config/swagger.conf.js";
import { SERVER } from "./src/config/constants.conf.js";
import { connectDB } from "./src/config/db.conf.js";
import logger from "./src/config/logger.conf.js";
import { responseError, routeError } from "./src/utils/errorHandler.util.js";

import authRouter from './src/routes/auth.route.js';
import userRouter from './src/routes/user.route.js';
import socialRouter from './src/routes/social.route.js';
import passport from "passport";

const app = e();
app.set('trust proxy', true);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(cookieParser());
app.use(e.json());
app.use(morgan('short'));
app.disable('x-powered-by');
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}));

app.use(passport.initialize());
app.use('/api/auth', authRouter);
app.use('/api/auth', socialRouter);
app.use('/api/auth/users', userRouter);

app.use(responseError);
app.use(routeError);
app.listen(SERVER.PORT, SERVER.HOST, async () => {
    await connectDB();
    logger.info(`Server running successfully on http://${SERVER.HOST}:${SERVER.PORT}`);
})