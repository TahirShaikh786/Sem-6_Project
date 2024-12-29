import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";  // Import to handle ES modules file path
import { dirname } from "path";

// Files
import connectDB from "./config/db.js";
import homeRouter from "./routes/home-router.js";
import userRouter from "./routes/user-router.js";
import movieRouter from "./routes/movie-router.js";
import errorHandler from "./middleware/error-middleware.js";
import { log } from "console";

// Configuration
const corsOption = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credential: true,
};
dotenv.config();
connectDB();
const app = express();
app.use(cors(corsOption));
app.use(express.json());

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);   // Convert import.meta.url to file path
const __dirname = dirname(__filename);                // Get the directory name

// Routes
app.use("/api/v1", homeRouter);
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/movie", movieRouter);
// app.use('/Images', express.static(path.join(__dirname, 'public', 'Images')));

// Middleware
app.use(errorHandler);

// Server Running
app.listen(process.env.PORT, () => {
  console.log(`Server Started at http://localhost:${process.env.PORT}`);
});
