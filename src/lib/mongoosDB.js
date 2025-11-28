import mongoose from "mongoose";

const mongooseDB = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ mongooseDB  connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("mongooseDB  connection failed");
  }
};

export default mongooseDB;
