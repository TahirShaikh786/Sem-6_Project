import express from "express";
import * as movieController from "../controller/movies-controller.js";

const router = express.Router();

router.post("/import", movieController.importMovies);
router.get("/", movieController.getMovies);

export default router;