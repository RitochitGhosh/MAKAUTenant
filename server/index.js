import express from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.router.js';
import { connectToDB } from './utils/dbConnect.js';
import cookieParser from 'cookie-parser';
import propertyRouter from './routes/property.router.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();
const port = process.env.PORT || 3000;
connectToDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173', // Change after production
  credentials: true
}));
app.use(helmet());

// Serve static files BEFORE any catch-all routes
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// API Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/property", propertyRouter);

// API health check
app.get("/api", (req, res) => {
  res.send("API route is working!");
});

// Catch-all for React SPA routing
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(port, () => {
  console.log(`✅ Server is running on: http://localhost:${port}`);
});
