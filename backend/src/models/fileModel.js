import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    resortId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resort",
      required: true,
    },
    images: [String],
    videos: [String],
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
