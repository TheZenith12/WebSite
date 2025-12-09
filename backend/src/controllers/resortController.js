import { cloudinary, extractPublicId } from "../utils/cloudinary.js";
import File from "../models/fileModel.js";
import Resort from "../models/resortModel.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
// --------------------------------------------------
// ✅ GET ALL Resortsfqdx
// --------------------------------------------------
export const getResorts = async (req, res) => {
  try {
    const resorts = await Resort.aggregate([
      {
        $lookup: {
          from: "files",
          localField: "_id",
          foreignField: "resortsId",
          as: "files",
        },
      },
      {
        $addFields: { image: { $arrayElemAt: ["$files.images", 0] } },
      },
      { $project: { files: 0, __v: 0 } },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: resorts.length,
      resorts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------------------------
// ✅ GET Resort by ID
// --------------------------------------------------
export const getResortById = async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id);
    if (!resort) return res.status(404).json({ message: "Not found" });

    const files = await File.find({ resortsId: resort._id });
    res.json({ resort, files });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const createResort = async (req, res) => {
  try {
    let { name, description, price, location, lat, lng, images, videos } = req.body;

    // images/videos JSON parse
    try {
      if (typeof images === "string") {
  try { images = JSON.parse(images); } catch {}
}
if (typeof videos === "string") {
  try { videos = JSON.parse(videos); } catch {}
}

    } catch (err) {
      console.log("JSON parse error:", err);
    }

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    // 💥 lat/lng required тул энд шалгана
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude (lat) болон Longitude (lng) хоёул шаардлагатай!",
      });
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return res.status(400).json({
        success: false,
        message: "lat/lng нь тоо байх ёстой!",
      });
    }

    // Resort save
    const newResort = await Resort.create({
      name,
      description,
      location,
      lat: parsedLat,
      lng: parsedLng,
      price,
    });

    // File save
    const newFiles = new File({
      resortId: newResort._id,
      images: Array.isArray(images) ? images : [],
      videos: Array.isArray(videos) ? videos : [],
    });

    await newFiles.save();

    return res.status(201).json({
      success: true,
      resort: newResort,
      files: newFiles,
    });

  } catch (err) {
    console.error("Create resort error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const updateResort = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      name,
      description,
      location,
      lat,
      lng,
      price,
      newImages,
      newVideos,
      removedImages,
      removedVideos,
    } = req.body;

    // FormData → string JSON бол parse хийх
    try {
      if (typeof newImages === "string") newImages = JSON.parse(newImages);
      if (typeof newVideos === "string") newVideos = JSON.parse(newVideos);
      if (typeof removedImages === "string") removedImages = JSON.parse(removedImages);
      if (typeof removedVideos === "string") removedVideos = JSON.parse(removedVideos);
    } catch (error) {
      console.log("JSON parse failed", error);
    }

    // Safety arrays
    const newImagesSafe = Array.isArray(newImages) ? newImages : [];
    const newVideosSafe = Array.isArray(newVideos) ? newVideos : [];
    const removedImagesSafe = Array.isArray(removedImages) ? removedImages : [];
    const removedVideosSafe = Array.isArray(removedVideos) ? removedVideos : [];

    // Resort update
    await Resort.findByIdAndUpdate(id, { name, description, price, location, lat, lng }, { new: true });

    // Files document
    let files = await File.findOne({ resortsId: id });
    if (!files) files = new File({ resortsId: id, images: [], videos: [] });

    // Remove images
    if (Array.isArray(removedImagesSafe) && removedImagesSafe.length > 0) {
  for (let url of removedImagesSafe) {
    const publicId = extractPublicId(url);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Cloudinary image delete error:", err);
      }
    }
  }
}
    files.images = files.images.filter(img => !removedImagesSafe.includes(img));

    // Remove videos
    if (Array.isArray(removedVideosSafe) && removedVideosSafe.length > 0) {
  for (let url of removedVideosSafe) {
    const publicId = extractPublicId(url);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
      } catch (err) {
        console.error("Cloudinary video delete error:", err);
      }
    }
  }
}
    files.videos = files.videos.filter(v => !removedVideosSafe.includes(v));

    // Add new images/videos
    if (newImagesSafe.length > 0) files.images.push(...newImagesSafe);
    if (newVideosSafe.length > 0) files.videos.push(...newVideosSafe);

    await files.save();

    return res.json({ success: true, message: "Resort амжилттай шинэчлэгдлээ" });

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteResort = async (req, res) => {
  try {
    const { id } = req.params;

    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ message: "Not found" });

    const files = await File.find({ resortsId: id });

    await File.deleteMany({ resortsId: id });
    await Resort.findByIdAndDelete(id);

    res.json({ success: true, message: "Resort deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
