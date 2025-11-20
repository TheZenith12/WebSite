import { cloudinary, extractPublicId } from "../utils/cloudinary.js";
import File from "../models/fileModel.js";
import Resort from "../models/resortModel.js";

// --------------------------------------------------
// ✅ GET ALL Resorts
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
    const { name, description, price, location, images, videos } = req.body;

    const newResort = new Resort({ name, description, price, location });
    const savedResort = await newResort.save();

    if ((images?.length || 0) + (videos?.length || 0) > 0) {
      const newFile = new File({
        resortsId: savedResort._id,
        images: images || [],
        videos: videos || [],
      });
      await newFile.save();
    }

    res.status(201).json({
      success: true,
      message: "Resort амжилттай нэмэгдлээ",
      resort: savedResort,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateResort = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      name,
      description,
      price,
      location,
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
    await Resort.findByIdAndUpdate(id, { name, description, price, location }, { new: true });

    // Files document
    let files = await File.findOne({ resortsId: id });
    if (!files) files = new File({ resortsId: id, images: [], videos: [] });

    // Remove images
    for (let url of removedImagesSafe) {
      const publicId = extractPublicId(url);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }
    files.images = files.images.filter(img => !removedImagesSafe.includes(img));

    // Remove videos
    for (let url of removedVideosSafe) {
      const publicId = extractPublicId(url);
      if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
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
