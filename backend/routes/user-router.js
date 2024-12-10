import express from "express";
import * as userController from "../controller/user-controller.js";
import * as auth from "../middleware/auth.js"

const router = express.Router();

// Public Routes
router.post("/register", userController.signUp);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// Private Routes
router.get("/user", auth.protect, userController.getCurrentUser);
router.put("/:id", auth.protect, userController.updatedUser);
router.put("/password/:id", auth.protect, userController.updatePassword);
router.delete("/:id", auth.protect, userController.deleteUser);
router.get("/favourites", auth.protect, userController.getLikedMovies);
router.post("/favourites", auth.protect, userController.addLikedMovies);
router.delete("/favourites/empty", auth.protect, userController.emptyFavourites);

// Admin Routes
router.get("/admin", auth.protect, auth.admin, userController.getUsers);
router.delete("/admin/:id", auth.protect, auth.admin, userController.deleteUsers);

export default router;