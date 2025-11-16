import mongoose from "mongoose";
import Resort from "../models/resortModel.js";
import File from "../models/fileModel.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../utils/cloudinary.js";

// ============================================
// 🧩 Cloudinary URL-аас public_id гаргах функц
// ============================================
function extractPublicId(url) {
  if (!url || typeof url !== "string") return null;
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  let afterUpload = parts[1]; // upload/ дараах бүх path
  afterUpload = afterUpload.replace(/^v\d+\//, ""); // version prefix арилгах
  return afterUpload.split(".")[0]; // file extension-ийг хасах
}

// ============================================
// ✅ Админаас зөвхөн list харж байгаа нь шүү
// ============================================
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
        $addFields: {
          image: { $arrayElemAt: ["$files.images", 0] },
        },
      },
      {
        $project: {
          files: 0,
          __v: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: resorts.length,
      resorts,
    });
  } catch (err) {
    console.error("❌ getResorts алдаа:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ============================================
// ✅ GET resort by ID
// ============================================
export const getResortById = async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id);
    if (!resort) return res.status(404).json({ message: "Resort олдсонгүй" });

    const files = await File.find({ resortsId: resort._id });
    res.json({ resort, files });
  } catch (err) {
    console.error("❌ getResortById алдаа:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// ✅ CREATE new resort
// ============================================
export const createResort = async (req, res) => {
  try {
    const { name, description, price, location } = req.body;
    const newResort = new Resort({ name, description, price, location });
    const savedResort = await newResort.save();

    let images = [];
    let videos = [];

    if (req.files) {
      if (req.files.images) images = req.files.images.map((f) => f.path);
      if (req.files.videos) videos = req.files.videos.map((f) => f.path);

      if (images.length > 0 || videos.length > 0) {
        const newFile = new File({
          resortsId: savedResort._id,
          images,
          videos,
        });
        await newFile.save();
      }
    }

    res.status(201).json({
      success: true,
      message: "🏕️ Resort амжилттай нэмэгдлээ",
      resort: savedResort,
      images,
      videos,
    });
  } catch (error) {
    console.error("❌ Resort үүсгэхэд алдаа:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ✅ UPDATE resort
// ============================================
export const updateResort = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, location, removedImages, removedVideos } = req.body;

    const parsedRemovedImages = removedImages ? JSON.parse(removedImages) : [];
    const parsedRemovedVideos = removedVideos ? JSON.parse(removedVideos) : [];

    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ message: "Resort олдсонгүй" });

    // 📝 Үндсэн мэдээлэл шинэчлэх
    resort.name = name || resort.name;
    resort.description = description || resort.description;
    resort.price = price || resort.price;
    resort.location = location || resort.location;
    await resort.save();

    // 🗑️ Устгах хэсэг
    for (const url of parsedRemovedImages) {
      const publicId = extractPublicId(url);
      if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    }
    for (const url of parsedRemovedVideos) {
      const publicId = extractPublicId(url);
      if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    }

    // MongoDB-с устгах ($pull)
    if (parsedRemovedImages.length > 0) {
      await File.updateMany({ resortsId: id }, { $pull: { images: { $in: parsedRemovedImages } } });
    }
    if (parsedRemovedVideos.length > 0) {
      await File.updateMany({ resortsId: id }, { $pull: { videos: { $in: parsedRemovedVideos } } });
    }

    // Шинэ файлуудыг upload
    if (req.files?.images?.length) {
      const images = req.files.images.map((f) => f.path);
      await File.updateOne({ resortsId: id }, { $push: { images: { $each: images } } }, { upsert: true });
    }
    if (req.files?.videos?.length) {
      const videos = req.files.videos.map((f) => f.path);
      await File.updateOne({ resortsId: id }, { $push: { videos: { $each: videos } } }, { upsert: true });
    }

    // Хоосон File бичлэг устгах
    const files = await File.find({ resortsId: id });
    for (const f of files) {
      if (!(f.images?.length) && !(f.videos?.length)) {
        await File.deleteOne({ _id: f._id });
      }
    }

    const filesAfter = await File.find({ resortsId: id });
    res.json({
      success: true,
      message: "✅ Resort зураг болон бичлэг амжилттай шинэчлэгдлээ!",
      resort,
      files: filesAfter,
    });
  } catch (err) {
    console.error("❌ Resort шинэчлэхэд алдаа:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================
// ✅ DELETE resort + related files
// ============================================
export const deleteResort = async (req, res) => {
  try {
    const { id } = req.params;
    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ success: false, message: "Resort олдсонгүй" });

    const files = await File.find({ resortsId: id });

    for (const file of files) {
      for (const url of file.images || []) {
        const publicId = extractPublicId(url);
        if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      }
      for (const url of file.videos || []) {
        const publicId = extractPublicId(url);
        if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
      }
    }

    // DB устгах
    await File.deleteMany({ resortsId: id });
    await Resort.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "🏕️ Resort болон холбогдсон файлууд амжилттай устлаа",
    });
  } catch (err) {
    console.error("❌ Resort устгахад алдаа:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
