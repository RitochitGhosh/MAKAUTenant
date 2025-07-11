import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.router.js';
import { connectToDB } from './utils/dbConnect.js';

dotenv.config();
const port = process.env.PORT || 3000;
connectToDB();

const app = express();
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error!"

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})

app.get("/api/", (req, res) => {
    res.send("API route is working!")
})

app.listen(port, () => {
    console.log(`Server is running on : http://localhost:${port}`);
});