import express from "express";
import * as userController from "../controller/user-controller.js";
import * as auth from "../middleware/auth.js"

const router = express.Router();

// Public Routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// Private Routes
router.put("/", auth.protect, auth.admin, userController.updatedUser);

export default router;