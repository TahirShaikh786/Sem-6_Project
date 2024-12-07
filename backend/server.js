import express from "express";
import dotenv from "dotenv";

// Files
import connectDB from "./utils/db.js";
import homeRouter from "./routes/home-router.js";
import userRouter from "./routes/user-router.js";

// Configuration
dotenv.config();
connectDB();
const app = express();
app.use(express.json());

// Routes
app.use("/api/v1", homeRouter);
app.use("/api/v1/auth", userRouter);

// Server Running
app.listen(process.env.PORT, () => {
  console.log(`Server Started at http://localhost:${process.env.PORT}`);
});