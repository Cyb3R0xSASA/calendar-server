import e from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from 'cors';
import morgan from "morgan";
import { specialLogger } from "./src/config/logger.conf.js";


export const app = e();
app.set('trust proxy', true);
app.use(morgan('dev'));

app.use(cookieParser());
app.use(e.json());
app.disable('x-powered-by');
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}));

app.use(passport.initialize());
app.use(specialLogger);
