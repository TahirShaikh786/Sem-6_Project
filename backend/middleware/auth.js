import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.splitz(" ")[1];
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.id).select("-password");
      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

const admin = async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(400);
    throw new Error("Not authorized as an admin");
  }
};

export { generateToken, protect, admin };
