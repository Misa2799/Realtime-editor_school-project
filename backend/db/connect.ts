import mongoose from "mongoose";
import { MONGODB_URI } from "../env";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;
