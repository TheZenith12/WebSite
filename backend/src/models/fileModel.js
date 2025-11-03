import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    resortsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resort",
      required: true,
    },
    images: [String],
    videos: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Files", fileSchema);
