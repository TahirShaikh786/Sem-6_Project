import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import * as auth from "../middleware/auth.js";

// Public Controller
const register = async (req, res) => {
  const { userName, email, password, image } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(201).json({ message: "Email Already Registered!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      image,
    });
    if (user) {
      res.status(200).json({
        _id: user._id,
        username: user.userName,
        email: user._email,
        isAdmin: user.isAdmin,
        token: auth.generateToken(user._id),
      });
    } else {
      res.status(404);
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && bcrypt.compare(password, user.password)) {
      res.json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: "Inavalid Credentials" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
  } catch (error) {}
};

// Admin Controller
const updatedUser = async (req, res) => {
  const { userName, email, image } = req.body;
  try {
    const user = await User.findById(req.params._id);
    if (user) {
      user.userName = userName || user.userName;
      user.email = email || user.email;
      user.image = image || user.image;

      const updateUser = await user.save();

      res.json({
        userName: updateUser.userName,
        email: updateUser.email,
        image: updateUser.image,
        isAdmin: updateUser.isAdmin,
        token: auth.generateToken(updateUser._id),
      });
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export { register, login, logout, updatedUser };
