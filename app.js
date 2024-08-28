import express from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

import userRoute from './routes/user.route.js'
app.use('/api/users', userRoute)

//team endpoints
import teamRoutes from './routes/team.route.js'
app.use('/api/teams', teamRoutes);

export { app };