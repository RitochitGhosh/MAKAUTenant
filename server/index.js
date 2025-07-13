// imports
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.router.js';
import propertyRouter from './routes/property.router.js';
import { connectToDB } from './utils/dbConnect.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Required in ES Modules to simulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB + Middleware
connectToDB();
app.use(express.json());
app.use(cookieParser());


// API routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/property", propertyRouter);

// Health Check
app.get("/api/", (req, res) => {
  res.send("API route is working!");
});

// Serve static files (for Vite)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all route **after everything else**
app.all("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
})
// Error handler — last in chain
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";
  return res.status(statusCode).json({ success: false, statusCode, message });
});


// Start Server
app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
