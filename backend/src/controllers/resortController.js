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

// --------------------------------------------------
// ✅ CREATE Resort (Frontend direct upload → URL дамжуулна)
// --------------------------------------------------
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
    const {
      name,
      description,
      price,
      location,
      newImages,
      newVideos,
      removedImages,
      removedVideos,
    } = req.body;

    // 1️⃣ Resort update
    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ message: "Resort not found" });
    resort.name = name;
    resort.description = description;
    resort.price = price;
    resort.location = location;
    await resort.save();

    // 2️⃣ Files record авах
    let files = await File.findOne({ resortsId: id });
    if (!files) files = new File({ resortsId: id, images: [], videos: [] });

    // 3️⃣ Устгах зураг
    if (removedImages?.length) {
      for (let img of removedImages) {
        if (img.publicId) {
          await cloudinary.uploader.destroy(img.publicId);
        }
      }
      files.images = files.images.filter(img => !removedImages.some(r => r.publicId === img.publicId));
    }

    // 4️⃣ Устгах видео
    if (removedVideos?.length) {
      for (let v of removedVideos) {
        if (v.publicId) {
          await cloudinary.uploader.destroy(v.publicId, { resource_type: "video" });
        }
      }
      files.videos = files.videos.filter(v => !removedVideos.some(r => r.publicId === v.publicId));
    }

    // 5️⃣ Шинэ зургууд upload
    if (newImages?.length) {
      for (const file of newImages) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "resorts/images",
        });
        files.images.push({
          url: uploaded.secure_url,
          publicId: uploaded.public_id
        });
      }
    }

    // 6️⃣ Шинэ видеонууд нэмэх
    if (newVideos?.length) {
      files.videos.push(...newVideos.map(v => ({ url: v.url, publicId: v.publicId })));
    }

    // 7️⃣ Save
    await files.save();

    return res.json({
      success: true,
      message: "Resort амжилттай шинэчлэгдлээ",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const deleteResort = async (req, res) => {
  try {
    const { id } = req.params;

    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ message: "Resort not found" });

    const files = await File.findOne({ resortsId: id });

    // 1️⃣ Зураг устгах
    if (files?.images?.length) {
      for (const img of files.images) {
        if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
      }
    }

    // 2️⃣ Видео устгах
    if (files?.videos?.length) {
      for (const v of files.videos) {
        if (v.publicId) await cloudinary.uploader.destroy(v.publicId, { resource_type: "video" });
      }
    }

    // 3️⃣ DB-с устгах
    await File.deleteMany({ resortsId: id });
    await Resort.findByIdAndDelete(id);

    return res.json({ success: true, message: "Resort deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
