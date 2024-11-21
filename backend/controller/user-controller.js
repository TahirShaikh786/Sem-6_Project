import User from "../models/user-model.js";
import bcrypt from "bcryptjs";
import * as auth from "../middleware/auth.js";

// Public Controller
const signUp = async (req, res) => {
  try {
    const { userName, email, password, image } = req.body;

    if (!email || !password || !userName) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }
    if (password.length < 7) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast 7 Characters long",
      });
    }

    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      return res
        .status(201)
        .json({ success: false, message: "Email Already Registered!" });
    }
    const userExist = await User.findOne({ userName: userName });
    if (userExist) {
      return res
        .status(201)
        .json({ success: false, message: "Username Already Registered!" });
    }

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
    const Profile_Image =
      PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      image: Profile_Image,
    });

    if (user) {
      const userToken = auth.generateTokenAndSetCookie(user._id, res);
      res.status(200).json({
        _id: user._id,
        username: user.userName,
        email: user._email,
        isAdmin: user.isAdmin,
        image: user.image,
        token: userToken,
      });
    } else {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    console.log("Error in Registering User ", error.message);
    res.status(500).json({ success: false, message: "Tnternal Server Error" });
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
    res.clearCookie("token-CineFilm");
    res.status(200).json({success: true, message: "Successfully logged out"});
  } catch (error) {
    console.log("Error While doing Logout", error.message);
    res.status(500).json({ success: false, message:"Internal Server Error" });
  }
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
export { signUp, login, logout, updatedUser };
