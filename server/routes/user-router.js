import express from "express";
import * as userController from "../controller/user-controller.js";
import * as auth from "../middleware/Auth.js";

const router = express.Router();

router.post("/register", userController.registerUser);
router.get("/login", userController.loginUser);

// Private Routes
router.put("/", auth.protect, userController.updateUserProfile);
router.delete("/", auth.protect, userController.deleteUserProfile);
router.put("/password", auth.protect, userController.updatePassword);
router.get("/favorites", auth.protect, userController.getLikedMovies);
router.post("/favorites", auth.protect, userController.addLikedMovies);
router.delete("/favorites", auth.protect, userController.deleteAllLikedMovies);

// Admin Routes
router.get("/", auth.protect, auth.admin, userController.getAllUsers);
router.delete("/:id", auth.protect, auth.admin, userController.deleteUser);

export default router;