import asyncHandler from "express-async-handler";
import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/Auth.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, image } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User Already Exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      image,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
      console.log("Created");
    } else {
      res.status(400);
      throw new Error("Invalid User data");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Private Routes
const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, email, image } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      user.image = image || user.image;
      const updatedUser = await user.save();

      res.json({
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        image: updatedUser.image,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not Found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Can't Delete Admin User");
      }
      await user.deleteOne();
      res.json({ message: "User deleted Successfully" });
    } else {
      res.status(404);
      throw new Error("User not Found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: "Password Changed!" });
    } else {
      res.status(401);
      throw new Error("Invalid old password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getLikedMovies = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("likedMovies");
    if (user) {
      res.json(user.likedMovies);
    } else {
      res.status(404);
      throw new Error("User not Found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const addLikedMovies = asyncHandler(async (req, res) => {
  const { movieId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      if (user.likedMovies.includes(movieId)) {
        res.status(400);
        throw new Error("You already Liked this Movie");
      }
      user.likedMovies.push(movieId);
      await user.save();
      res.json(user.likedMovies);
    } else {
      res.status(404);
      throw new Error("Movie not Found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteAllLikedMovies = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.likedMovies = [];
      await user.save();
      res.json({ message: "Your Favourites List is now Empty" });
    } else {
      res.status(404);
      throw new Error("Nothing to remove");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin Routes
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if(user){
      if(user.admin){
        res.status(400);
        throw new Error("Can't Delete admin user");
      }
      await user.deleteOne();
      res.json({message: "User deleted Successfully"});
    }else{
      res.status(404);
      throw new Error("Operation Unsuccessfull!")
    }
  } catch (error) {
    res.status(400).json({message: error.message});
  }
})

export {
  registerUser,
  loginUser,
  updateUserProfile,
  deleteUserProfile,
  updatePassword,
  getLikedMovies,
  addLikedMovies,
  deleteAllLikedMovies,
  getAllUsers,
  deleteUser
};
