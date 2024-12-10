import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Files
import connectDB from "./config/db.js";
import homeRouter from "./routes/home-router.js";
import userRouter from "./routes/user-router.js";
import movieRouter from "./routes/movie-router.js";
import errorHandler from "./middleware/error-middleware.js";

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

// Routes
app.use("/api/v1", homeRouter);
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/movie", movieRouter);

// Middleware
app.use(errorHandler);

// Server Running
app.listen(process.env.PORT, () => {
  console.log(`Server Started at http://localhost:${process.env.PORT}`);
});
