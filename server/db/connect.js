
import mongoose from "mongoose";

async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit the process if connection fails
  }
}

export default connectDB;
