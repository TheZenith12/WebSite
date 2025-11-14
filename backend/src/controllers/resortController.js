import mongoose from "mongoose";
import Resort from "../models/resortModel.js";
import File from "../models/fileModel.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";


// ============================================
// GET ALL RESORTS (ADMIN LIST)
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
          image: { $arrayElemAt: ["$files.images.url", 0] },
        },
      },
      {
        $project: { files: 0, __v: 0 },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({ success: true, resorts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ============================================
// GET RESORT BY ID
// ============================================
export const getResortById = async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id);
    if (!resort) return res.status(404).json({ message: "Resort олдсонгүй" });

    const files = await File.find({ resortsId: resort._id });

    res.json({ resort, files });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ============================================
// CREATE RESORT + CLOUDINARY FILES
// ============================================
export const createResort = async (req, res) => {
  try {
    const { name, description, price, location } = req.body;

    const newResort = await Resort.create({
      name,
      description,
      price,
      location,
    });

    let images = [];
    let videos = [];

    // Upload images
    if (req.files?.images) {
      for (const file of req.files.images) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "amaralt/resorts/images",
        });
        images.push({
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        });
      }
    }

    // Upload videos
    if (req.files?.videos) {
      for (const file of req.files.videos) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "amaralt/resorts/videos",
          resource_type: "video",
        });
        videos.push({
          url: uploaded.secure_url,
          public_id: uploaded.public_id,
        });
      }
    }

    // Save to File collection
    if (images.length > 0 || videos.length > 0) {
      await File.create({
        resortsId: newResort._id,
        images,
        videos,
      });
    }

    res.status(201).json({
      success: true,
      message: "🏕️ Resort амжилттай нэмэгдлээ",
      resort: newResort,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ============================================
// UPDATE RESORT (Cloudinary delete + add)
// ============================================
export const updateResort = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, location, removedImages, removedVideos } = req.body;

    const removedImg = removedImages ? JSON.parse(removedImages) : [];
    const removedVid = removedVideos ? JSON.parse(removedVideos) : [];

    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ message: "Resort олдсонгүй" });

    // Update base info
    resort.name = name || resort.name;
    resort.description = description || resort.description;
    resort.price = price || resort.price;
    resort.location = location || resort.location;
    await resort.save();

    // Delete removed images (Cloudinary)
    for (const img of removedImg) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }

    // Delete removed videos
    for (const vid of removedVid) {
      if (vid.public_id) {
        await cloudinary.uploader.destroy(vid.public_id, { resource_type: "video" });
      }
    }

    // Remove from DB
    await File.updateMany(
      { resortsId: id },
      { 
        $pull: { 
          images: { public_id: { $in: removedImg.map(i => i.public_id) } },
          videos: { public_id: { $in: removedVid.map(v => v.public_id) } },
        }
      }
    );

    // UPLOAD NEW IMAGES
    if (req.files?.images) {
      const uploadedImages = [];
      for (const file of req.files.images) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "amaralt/resorts/images",
        });
        uploadedImages.push({
          url: upload.secure_url,
          public_id: upload.public_id,
        });
      }

      await File.updateOne(
        { resortsId: id },
        { $push: { images: { $each: uploadedImages } } },
        { upsert: true }
      );
    }

    // UPLOAD NEW VIDEOS
    if (req.files?.videos) {
      const uploadedVideos = [];
      for (const file of req.files.videos) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "amaralt/resorts/videos",
          resource_type: "video",
        });
        uploadedVideos.push({
          url: upload.secure_url,
          public_id: upload.public_id,
        });
      }

      await File.updateOne(
        { resortsId: id },
        { $push: { videos: { $each: uploadedVideos } } },
        { upsert: true }
      );
    }

    const files = await File.find({ resortsId: id });

    res.json({
      success: true,
      message: "Resort амжилттай шинэчлэгдлээ!",
      resort,
      files,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ============================================
// DELETE RESORT + CLOUDINARY FILES
// ============================================
export const deleteResort = async (req, res) => {
  try {
    const { id } = req.params;

    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ message: "Resort олдсонгүй" });

    const files = await File.find({ resortsId: id });

    // Delete cloudinary images/videos
    for (const file of files) {
      for (const img of file.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
      for (const vid of file.videos) {
        await cloudinary.uploader.destroy(vid.public_id, { resource_type: "video" });
      }
    }

    await File.deleteMany({ resortsId: id });
    await Resort.findByIdAndDelete(id);

    res.json({ success: true, message: "Resort устгагдлаа" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
