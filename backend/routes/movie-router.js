import express from "express";
import * as auth from "../middleware/auth.js";
import * as movieController from "../controller/movie-controller.js";

const router = express.Router();

// Public Routes
router.post("/import", movieController.addMoviesToDB);
router.get("/all", movieController.getAllMovies);
router.get("/", movieController.getMovies);
router.get("/:id", movieController.getMovieById);
router.get("/reviews/:id", movieController.getMovieReviews);
router.get("/top/rated", movieController.getTopRatedMovies);
router.get("/mix/random", movieController.getRandomMovies);

// Private Routes
router.post("/:id/reviews", auth.protect, movieController.createMovieReview);

// Admin Routes
router.put("/:id", auth.protect, auth.admin, movieController.updateMovie);
router.delete(":id", auth.protect, auth.admin, movieController.deleteMovie);
router.delete("/", auth.protect, auth.admin, movieController.deleteAllMovie);
router.post("/", auth.protect, auth.admin, movieController.createMovie);

export default router;
