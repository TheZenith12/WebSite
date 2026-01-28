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
          foreignField: "resortId",
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
    alert("0");
    const [show, setShow] = useState(false);

{show && (
  <div className="alert">
    Амжилттай!
    <button onClick={() => setShow(false)}>OK</button>
  </div>
)}

    let {
      name,
      description,
      price,
      location,
      lat,
      lng,
      newImages,
      newVideos,
      removedImages,
      removedVideos,
    } = req.body;

    // ---------- JSON parse (add шиг) ----------
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

    // ---------- Resort fetch ----------
    const resort = await Resort.findById(id);
    if (!resort) {
      return res.status(404).json({ success: false, message: "Resort not found" });
    }

    // ---------- lat/lng (add шиг шалгалт) ----------
    if (lat !== undefined && lng !== undefined) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);

      if (isNaN(parsedLat) || isNaN(parsedLng)) {
        return res.status(400).json({
          success: false,
          message: "lat/lng нь тоо байх ёстой!",
        });
      }

      resort.lat = parsedLat;
      resort.lng = parsedLng;
    }

    // ---------- basic fields ----------
    if (name) resort.name = name;
    if (description) resort.description = description;
    if (location) resort.location = location;
    if (price !== undefined) resort.price = Number(price);

    await resort.save();

    // ---------- File logic (add шиг) ----------
    let files = await File.findOne({ resortId: id });
    if (!files) {
      files = new File({
        resortId: id,
        images: [],
        videos: [],
      });
    }

    // Remove images
    for (const url of removedImages) {
      alert("1");
      const publicId = extractPublicId(url);
      alert("2");
      if (publicId) await cloudinary.uploader.destroy(publicId);
      alert("3");
    }
    files.images = files.images.filter(img => !removedImages.includes(img));
    alert("4");


    // Remove videos
    for (const url of removedVideos) {
      const publicId = extractPublicId(url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
      }
    }
    files.videos = files.videos.filter(v => !removedVideos.includes(v));

    // Add new files
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
    if (!resort) return res.status(404).json({ message: "Not found" });

    const files = await File.find({ resortId: id });

    await File.deleteMany({ resortId: id });
    await Resort.findByIdAndDelete(id);

    res.json({ success: true, message: "Resort deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
