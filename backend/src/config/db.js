<<<<<<< HEAD
import mongoose from "mongoose";
=======
import mongoose from 'mongoose';

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/amraltiin_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoose;


>>>>>>> 9310555b0ec6973cd29ec22de5359ab6afbc33a4

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
