import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.DB_URI);
        console.log("Connected to DB");
        
    } catch (error) {
        console.log(`Not Connecting ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;