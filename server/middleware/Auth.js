import jwt from "jsonwebtoken";
import User from "../models/user-model.js";
import asyncHandler from "express-async-handler";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, token invalid");
    }
  }
  if(!token){
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = asyncHandler(async (req, res, next) => {
  if(req.user && req.user.isAdmin){
    next();
  }else{
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
})

export { generateToken, protect, admin };
