import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

const generateTokenAndSetCookie = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("token-CineFilm", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 in MS
    httpOnly: true, // prevent XSS attacks & cross-site attacks not accessible by JS
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decode.id).select("-password");
      return next();
    } catch (error) {
      res.status(400).json({ success: false, message: "Not authorized, token Invalid" });
    }
  }
  if (!token) {
    res.status(401).json({success: false, message: "Not authorized, no token"});
  }
};

const admin = async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  } else {
    res.status(400).json({sucess: false, message:"Not authorized as an admin"});
  }
};

export { generateTokenAndSetCookie, protect, admin };
