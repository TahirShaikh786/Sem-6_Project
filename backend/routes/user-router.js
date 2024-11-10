import express from "express";
import * as userController from "../controller/user-controller.js";
import * as auth from "../middleware/auth.js"

const router = express.Router();

// Public Routes
router.post("/register", auth.protect, userController.register);
router.post("/login", auth.protect, userController.login);
router.post("/logout", auth.protect, userController.logout);

// Private Routes
router.put("/", auth.protect, auth.admin, userController.updatedUser);

export default router;