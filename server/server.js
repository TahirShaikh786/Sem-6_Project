import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Files
import connectDB from "./config/db.js";
import homeRouter from "./routes/home-router.js";
import userRouter from "./routes/user-router.js";
import movieRouter from "./routes/movies-router.js";
import errorhandler from "./middleware/error-middleware.js";

// Configuration
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", homeRouter);
app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);

// Middleware
app.use(errorhandler);

// Server Part
const PORT =  3000;
connectDB();

app.listen(PORT, () => {
    console.log(`Server is Running at http://localhost:${PORT}`);    
})