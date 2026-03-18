<<<<<<< Updated upstream
import mongoose from "mongoose";
=======

import mongoose from "mongoose";

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/amraltiin_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = mongoose;


>>>>>>> Stashed changes

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/amraltiin_db";

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
