import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log(`Connected to MongoDB`);
}).catch((err) => {
    console.error(err);
});

const app = express();
const port = process.env.PORT || 3000;

app.use("/api/user", userRouter);


app.get("/api/", (req, res) => {
    res.send("API route is working!")
})

app.listen(port, () => {
    console.log(`Server is running on : http://localhost:${port}`);
});