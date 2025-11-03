import mongoose from "mongoose";

const resortSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: Number,
    location: String,
},
  { timestamps: true }
);

export default mongoose.model("Resort", resortSchema);
