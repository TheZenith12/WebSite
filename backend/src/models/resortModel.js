import mongoose from "mongoose";

const resortSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    location: String,
    lat: {
       type: Number,
       required: true
      },
    lng: {
       type: Number,
       required: true
     },
    price: Number,
},
  { timestamps: true }
);

export default mongoose.model("Resort", resortSchema);
