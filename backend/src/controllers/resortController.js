import { cloudinary, extractPublicId } from "../utils/cloudinary.js";
import File from "../models/fileModel.js";
import Resort from "../models/resortModel.js";

// Parse JSON utility
const parseJSON = (data) => {
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return []; }
  }
  return Array.isArray(data) ? data : [];
};

// Cloudinary delete utility
const deleteCloudinaryFile = async (url, resourceType = "image") => {
  const publicId = extractPublicId(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error(`❌ Cloudinary ${resourceType} delete error:`, err.message);
  }
};

// Get all resorts
export const getResorts = async (req, res) => {
  try {
    const resorts = await Resort.aggregate([
      {
        $lookup: {
          from: "files",
          localField: "_id",
          foreignField: "resortId",
          as: "fileData"
        }
      },
      {
        $addFields: {
          images: { $arrayElemAt: ["$fileData.images", 0] },
          videos: { $arrayElemAt: ["$fileData.videos", 0] }
        }
      },
      { $project: { fileData: 0, __v: 0 } },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: resorts.length,
      resorts
    });
  } catch (err) {
    console.error("❌ Get resorts error:", err);
    res.status(500).json({
      success: false,
      message: "Жагсаалт татахад алдаа гарлаа"
    });
  }
};

// Get resort by ID
export const getResortById = async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id);
    
    if (!resort) {
      return res.status(404).json({
        success: false,
        message: "Resort олдсонгүй"
      });
    }

    const files = await File.findOne({ resortId: resort._id });

    res.status(200).json({
      success: true,
      resort,
      files: files || { images: [], videos: [] }
    });
  } catch (err) {
    console.error("❌ Get resort error:", err);
    res.status(500).json({
      success: false,
      message: "Resort татахад алдаа гарлаа"
    });
  }
};

// Create resort
export const createResort = async (req, res) => {
  try {
    let { name, description, price, location, lat, lng, images, videos } = req.body;

    images = parseJSON(images);
    videos = parseJSON(videos);

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Нэр заавал шаардлагатай"
      });
    }

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Координат (lat, lng) заавал шаардлагатай"
      });
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return res.status(400).json({
        success: false,
        message: "Координат зөв тоо байх ёстой"
      });
    }

    const resort = await Resort.create({
      name,
      description,
      location,
      lat: parsedLat,
      lng: parsedLng,
      price: price ? Number(price) : 0
    });

    const files = await File.create({
      resortId: resort._id,
      images,
      videos
    });

    res.status(201).json({
      success: true,
      message: "Resort амжилттай үүсгэлээ",
      resort,
      files
    });
  } catch (err) {
    console.error("❌ Create resort error:", err);
    res.status(500).json({
      success: false,
      message: "Resort үүсгэхэд алдаа гарлаа"
    });
  }
};

// Update resort
export const updateResort = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, description, price, location, lat, lng, status, newImages, newVideos, removedImages, removedVideos } = req.body;

    newImages = parseJSON(newImages);
    newVideos = parseJSON(newVideos);
    removedImages = parseJSON(removedImages);
    removedVideos = parseJSON(removedVideos);

    const resort = await Resort.findById(id);
    
    if (!resort) {
      return res.status(404).json({
        success: false,
        message: "Resort олдсонгүй"
      });
    }

    if (name) resort.name = name;
    if (description !== undefined) resort.description = description;
    if (location !== undefined) resort.location = location;
    if (price !== undefined) resort.price = Number(price);
    if (status) resort.status = status;

    if (lat !== undefined && lng !== undefined) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);

      if (isNaN(parsedLat) || isNaN(parsedLng)) {
        return res.status(400).json({
          success: false,
          message: "Координат зөв тоо байх ёстой"
        });
      }

      resort.lat = parsedLat;
      resort.lng = parsedLng;
    }

    await resort.save();

    let files = await File.findOne({ resortId: id });
    
    if (!files) {
      files = await File.create({
        resortId: id,
        images: [],
        videos: []
      });
    }

    if (removedImages.length > 0) {
      for (const url of removedImages) {
        await deleteCloudinaryFile(url, "image");
      }
      files.images = files.images.filter(img => !removedImages.includes(img));
    }

    if (removedVideos.length > 0) {
      for (const url of removedVideos) {
        await deleteCloudinaryFile(url, "video");
      }
      files.videos = files.videos.filter(vid => !removedVideos.includes(vid));
    }

    if (newImages.length > 0) files.images.push(...newImages);
    if (newVideos.length > 0) files.videos.push(...newVideos);

    await files.save();

    res.status(200).json({
      success: true,
      message: "Resort амжилттай шинэчлэгдлээ",
      resort,
      files
    });
  } catch (err) {
    console.error("❌ Update resort error:", err);
    res.status(500).json({
      success: false,
      message: "Resort шинэчлэхэд алдаа гарлаа"
    });
  }
};

// Delete resort
export const deleteResort = async (req, res) => {
  try {
    const { id } = req.params;

    const resort = await Resort.findById(id);
    
    if (!resort) {
      return res.status(404).json({
        success: false,
        message: "Resort олдсонгүй"
      });
    }

    const files = await File.findOne({ resortId: id });
    
    if (files) {
      for (const url of files.images) {
        await deleteCloudinaryFile(url, "image");
      }
      for (const url of files.videos) {
        await deleteCloudinaryFile(url, "video");
      }
      await File.findByIdAndDelete(files._id);
    }

    await Resort.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Resort амжилттай устгагдлаа"
    });
  } catch (err) {
    console.error("❌ Delete resort error:", err);
    res.status(500).json({
      success: false,
      message: "Resort устгахад алдаа гарлаа"
    });
  }
};