import Resort from "../models/resortModel.js";
import File from "../models/fileModel.js";
import cloudinary from "../utils/cloudinary.js";

// --------------------------------------------------
// 🧩 Cloudinary public_id гаргах функц
// --------------------------------------------------
function extractPublicId(url) {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let rest = parts[1];
    rest = rest.replace(/^v\d+\//, "");
    return rest.split(".")[0];
  } catch {
    return null;
  }
}

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
      images,
      videos,
      removedImages,
      removedVideos,
    } = req.body;

    // ✅ Resort олж авах
    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ message: "Resort олдсонгүй" });

    // ✅ Үндсэн мэдээлэл шинэчлэх
    resort.name = name || resort.name;
    resort.description = description || resort.description;
    resort.price = price || resort.price;
    resort.location = location || resort.location;
    await resort.save();

    // 🗑️ Cloudinary дээр устгах
    if (removedImages?.length) {
      for (const url of removedImages) {
        const publicId = extractPublicId(url);
        if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      }
    }

    if (removedVideos?.length) {
      for (const url of removedVideos) {
        const publicId = extractPublicId(url);
        if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
      }
    }

    // ✅ MongoDB update
    await File.updateOne(
      { resortsId: id },
      {
        $pull: {
          images: { $in: removedImages || [] },
          videos: { $in: removedVideos || [] },
        },
        $push: {
          images: { $each: images || [] },
          videos: { $each: videos || [] },
        },
      },
      { upsert: true }
    );

    res.json({ success: true, message: "Resort updated successfully", resort });
  } catch (err) {
    console.error("❌ updateResort error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------------------------
// ✅ DELETE Resort (Cloudinary + MongoDB)
// --------------------------------------------------
export const deleteResort = async (req, res) => {
  try {
    const { id } = req.params;

    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ message: "Not found" });

    const files = await File.find({ resortsId: id });

    for (const f of files) {
      for (const url of f.images || []) {
        const pid = extractPublicId(url);
        if (pid) await cloudinary.uploader.destroy(pid, { resource_type: "image" });
      }
      for (const url of f.videos || []) {
        const pid = extractPublicId(url);
        if (pid) await cloudinary.uploader.destroy(pid, { resource_type: "video" });
      }
    }

    await File.deleteMany({ resortsId: id });
    await Resort.findByIdAndDelete(id);

    res.json({ success: true, message: "Resort deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
