import { cloudinary, extractPublicId } from "../utils/cloudinary.js";
import File from "../models/fileModel.js";
import Resort from "../models/resortModel.js";

export const getResorts = async (req, res) => {
  try {
    const resorts = await Resort.aggregate([
      {
        $lookup: {
          from: "files",
          localField: "_id",
          foreignField: "resortId",
          as: "files",
        },
      },
      {
        $addFields: {
          images: { $arrayElemAt: ["$files.images", 0] },
          videos: { $arrayElemAt: ["$files.videos", 0] },
        },
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
    if (!resort) {
      return res.status(404).json({ success: false, message: "Resort not found" });
    }

    const files = await File.findOne({ resortId: resort._id });

    res.json({
      success: true,
      resort,
      files: files || { images: [], videos: [] },
    });
  } catch (err) {
    console.error("GET RESORT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createResort = async (req, res) => {
  try {
    let {
      name, description, phone, price, location, lat, lng,
      images, videos,
      category, // ← шинэ
    } = req.body;

    try {
      if (typeof images === "string") { try { images = JSON.parse(images); } catch {} }
      if (typeof videos === "string") { try { videos = JSON.parse(videos); } catch {} }
    } catch (err) {
      console.log("JSON parse error:", err);
    }

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude (lat) болон Longitude (lng) хоёул шаардлагатай!",
      });
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return res.status(400).json({ success: false, message: "lat/lng нь тоо байх ёстой!" });
    }

    // category validation
    const validCategories = ["suvilal", "juulchnii_baaz", "uzseglent_gazar"];
    const safeCategory = validCategories.includes(category) ? category : "suvilal";

    const newResort = await Resort.create({
      name,
      description,
      phone,
      location,
      lat: parsedLat,
      lng: parsedLng,
      price,
      category: safeCategory, // ← хадгалж байна
    });

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
      name, description, phone, price, location, lat, lng,
      newImages, newVideos, removedImages, removedVideos,
      category, // ← шинэ
    } = req.body;

    try {
      if (typeof newImages === "string") newImages = JSON.parse(newImages);
      if (typeof newVideos === "string") newVideos = JSON.parse(newVideos);
      if (typeof removedImages === "string") removedImages = JSON.parse(removedImages);
      if (typeof removedVideos === "string") removedVideos = JSON.parse(removedVideos);
    } catch (e) {
      console.log("JSON parse error:", e);
    }

    newImages = Array.isArray(newImages) ? newImages : [];
    newVideos = Array.isArray(newVideos) ? newVideos : [];
    removedImages = Array.isArray(removedImages) ? removedImages : [];
    removedVideos = Array.isArray(removedVideos) ? removedVideos : [];

    const resort = await Resort.findById(id);
    if (!resort) {
      return res.status(404).json({ success: false, message: "Resort not found" });
    }

    if (lat !== undefined && lng !== undefined) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      if (isNaN(parsedLat) || isNaN(parsedLng)) {
        return res.status(400).json({ success: false, message: "lat/lng нь тоо байх ёстой!" });
      }
      resort.lat = parsedLat;
      resort.lng = parsedLng;
    }

    if (name) resort.name = name;
    if (description) resort.description = description;
    if (phone) resort.phone = phone;
    if (location) resort.location = location;
    if (price !== undefined) resort.price = Number(price);

    // category шинэчлэлт
    const validCategories = ["suvilal", "juulchnii_baaz", "uzseglent_gazar"];
    if (category && validCategories.includes(category)) {
      resort.category = category;
    }

    await resort.save();

    let files = await File.findOne({ resortId: id });
    if (!files) {
      files = new File({ resortId: id, images: [], videos: [] });
    }

    for (const url of removedImages) {
      const publicId = extractPublicId(url);
      if (!publicId) continue;
      try { await cloudinary.uploader.destroy(publicId); } catch (err) { console.error("Cloudinary image delete error:", err); }
    }
    files.images = files.images.filter((img) => !removedImages.includes(img));

    for (const url of removedVideos) {
      const publicId = extractPublicId(url);
      if (!publicId) continue;
      try { await cloudinary.uploader.destroy(publicId, { resource_type: "video" }); } catch (err) { console.error("Cloudinary video delete error:", err); }
    }
    files.videos = files.videos.filter((v) => !removedVideos.includes(v));

    if (newImages.length) files.images.push(...newImages);
    if (newVideos.length) files.videos.push(...newVideos);

    await files.save();

    return res.json({
      success: true,
      message: "Resort амжилттай шинэчлэгдлээ",
      resort,
      files,
    });
  } catch (err) {
    console.error("UPDATE RESORT ERROR ❌", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteResort = async (req, res) => {
  try {
    const { id } = req.params;

    const resort = await Resort.findById(id);
    if (!resort) {
      return res.status(404).json({ success: false, message: "Resort not found" });
    }

    const files = await File.findOne({ resortId: id });

    if (files) {
      for (const img of files.images || []) {
        try { await cloudinary.uploader.destroy(extractPublicId(img)); } catch (err) { console.error("Cloudinary image delete error:", err); }
      }
      for (const vid of files.videos || []) {
        try { await cloudinary.uploader.destroy(extractPublicId(vid), { resource_type: "video" }); } catch (err) { console.error("Cloudinary video delete error:", err); }
      }
      await File.findByIdAndDelete(files._id);
    }

    await Resort.findByIdAndDelete(id);

    res.json({ success: true, message: "Resort deleted" });
  } catch (err) {
    console.error("DELETE RESORT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};