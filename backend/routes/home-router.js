import express from "express";
import * as homeController from "../controller/home-controller.js";

const router = express.Router();

router.get("/", homeController.home);

export default router;