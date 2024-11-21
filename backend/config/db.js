import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Databse");
  } catch (error) {
    console.log("Not Connected");
  }
};

export default connectDB;