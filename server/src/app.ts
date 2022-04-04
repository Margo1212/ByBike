import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from './auth/router';

dotenv.config();

const app = express();

app.use(cookieParser());
app.use('/api', express.json());
app.use('/api/auth', authRouter);

export { app };
