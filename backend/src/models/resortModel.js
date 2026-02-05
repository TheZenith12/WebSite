import mongoose from "mongoose";

const resortSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Нэр заавал шаардлагатай"],
      trim: true,
      minlength: [3, "Нэр 3-аас дээш тэмдэгт байх ёстой"]
    },
    
    description: {
      type: String,
      trim: true
    },
    
    location: {
      type: String,
      trim: true
    },

    lat: {
      type: Number,
      required: [true, "Өргөрөг (latitude) шаардлагатай"],
      min: [-90, "Latitude -90 ~ 90 хооронд байх ёстой"],
      max: [90, "Latitude -90 ~ 90 хооронд байх ёстой"]
    },

    lng: {
      type: Number,
      required: [true, "Уртраг (longitude) шаардлагатай"],
      min: [-180, "Longitude -180 ~ 180 хооронд байх ёстой"],
      max: [180, "Longitude -180 ~ 180 хооронд байх ёстой"]
    },

    price: {
      type: Number,
      min: [0, "Үнэ сөрөг байж болохгүй"],
      default: 0
    },

    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active"
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for files
resortSchema.virtual("files", {
  ref: "File",
  localField: "_id",
  foreignField: "resortId",
  justOne: true
});

// Index for faster queries
resortSchema.index({ name: 1, location: 1 });
resortSchema.index({ lat: 1, lng: 1 });

export default mongoose.model("Resort", resortSchema);