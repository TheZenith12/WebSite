import { cloudinary, extractPublicId } from "../utils/cloudinary.js";
import File from "../models/fileModel.js";
import Resort from "../models/resortModel.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

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

    // Parse JSON strings
    if (typeof newImages === "string") newImages = JSON.parse(newImages);
    if (typeof newVideos === "string") newVideos = JSON.parse(newVideos);
    if (typeof removedImages === "string") removedImages = JSON.parse(removedImages);
    if (typeof removedVideos === "string") removedVideos = JSON.parse(removedVideos);

    const newImagesSafe = Array.isArray(newImages) ? newImages : [];
    const newVideosSafe = Array.isArray(newVideos) ? newVideos : [];
    const removedImagesSafe = Array.isArray(removedImages) ? removedImages : [];
    const removedVideosSafe = Array.isArray(removedVideos) ? removedVideos : [];

    // Number cast
    price = price !== "" && price !== undefined ? Number(price) : undefined;
    lat = lat !== "" && lat !== undefined ? Number(lat) : undefined;
    lng = lng !== "" && lng !== undefined ? Number(lng) : undefined;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (location) updateData.location = location;
    if (price !== undefined) updateData.price = price;
    if (lat !== undefined) updateData.lat = lat;
    if (lng !== undefined) updateData.lng = lng;

    const resort = await Resort.findByIdAndUpdate(id, updateData, { new: true });
    if (!resort) {
  return res.status(404).json({ message: "Resort not found" });
}

if (images && images.length > 0) {
  resort.images = [...resort.images, ...images];
}

if (videos && videos.length > 0) {
  resort.videos = [...resort.videos, ...videos];
}

await resort.save();

    let files = await File.findOne({ resortsId: id });
    if (!files) files = new File({ resortsId: id, images: [], videos: [] });

    files.images = Array.isArray(files.images) ? files.images : [];
    files.videos = Array.isArray(files.videos) ? files.videos : [];

    // Remove images
    for (const url of removedImagesSafe) {
      const publicId = extractPublicId(url);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }
    files.images = files.images.filter(img => !removedImagesSafe.includes(img));

    // Remove videos
    for (const url of removedVideosSafe) {
      const publicId = extractPublicId(url);
      if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    }
    files.videos = files.videos.filter(v => !removedVideosSafe.includes(v));

    if (newImagesSafe.length) files.images.push(...newImagesSafe);
    if (newVideosSafe.length) files.videos.push(...newVideosSafe);

    await files.save();

    res.json({ success: true, message: "Resort амжилттай шинэчлэгдлээ" });
  } catch (err) {
    console.error("UPDATE RESORT ERROR ❌", err);
    res.status(500).json({ success: false, message: err.message });
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
