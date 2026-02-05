import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    resortId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resort",
      required: [true, "Resort ID шаардлагатай"],
      unique: true,
      index: true
    },
    
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr) {
          return arr.every(url => /^https?:\/\/.+/.test(url));
        },
        message: "Зөв URL хэлбэртэй байх ёстой"
      }
    },
    
    videos: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr) {
          return arr.every(url => /^https?:\/\/.+/.test(url));
        },
        message: "Зөв URL хэлбэртэй байх ёстой"
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);