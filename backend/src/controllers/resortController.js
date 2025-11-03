import mongoose from "mongoose";
import Resort from "../models/resortModel.js";
import File from "../models/fileModel.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// ============================================
// ✅ Админаас зөвхөн list харж байгаа нь шүү
// ============================================

export const getResorts = async (req, res) => {
  try {
    const resorts = await Resort.aggregate([
      {
        $lookup: {
          from: "files",           // File collection
          localField: "_id",       // Resort._id
          foreignField: "resortsId", // File.resortsId
          as: "files"
        }
      },
      {
        $addFields: {
          image: { 
            $arrayElemAt: [ "$files.images", 0 ] // эхний зураг л авна
          }
        }
      },
      {
        $project: {
          files: 0, // files array-г нуух
          __v: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: resorts.length,
      resorts
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

    // Resort-д холбогдсон файлуудыг авчрах
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
    console.log("create begin");

    // 1️⃣ Resort үүсгэх
    const newResort = new Resort({
      name,
      description,
      price,
      location,
    });

    const savedResort = await newResort.save();

    // --- newFile-ийг гадна зарлах ---
    let newFile;

    // 2️⃣ Файлууд хадгалах
    if (req.files && (req.files.images || req.files.videos)) {
      const images =
        req.files.images?.map((f) => `/uploads/resorts/${f.filename}`) || [];

      const videos =
        req.files.videos?.map((f) => `/uploads/resorts/${f.filename}`) || [];

      newFile = new File({
        resortsId: savedResort._id,
        images,
        videos,
      });

      await newFile.save();
    }

    res.status(201).json({
      success: true,
      message: "🏕️ Resort амжилттай нэмэгдлээ",
      resort: savedResort,
    });
  } catch (error) {
    console.error("❌ Resort үүсгэхэд алдаа:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//  UPDATE resort 
export const updateResort = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, location, removedImages, removedVideos } = req.body;

    // 🧩 JSON string-үүдийг parse хийх
    const parsedRemovedImages = removedImages ? JSON.parse(removedImages) : [];
    const parsedRemovedVideos = removedVideos ? JSON.parse(removedVideos) : [];

    // 🧩 Resort олох
    const resort = await Resort.findById(id);
    if (!resort) {
      return res.status(404).json({ message: "Resort олдсонгүй" });
    }

    // 🧩 Resort үндсэн мэдээлэл шинэчлэх
    resort.name = name || resort.name;
    resort.description = description || resort.description;
    resort.price = price || resort.price;
    resort.location = location || resort.location;
    await resort.save();

    // =============================
    // 🗑️ Устгасан зураг, бичлэгийг устгах
    // =============================

    // 📸 Зураг устгах
    for (const imgPath of parsedRemovedImages) {
      const fullPath = path.join(process.cwd(), "public", imgPath.replace(/^\/+/, ""));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log("🧹 Deleted image:", fullPath);
      }
    }

    // 🎥 Видео устгах
    for (const vidPath of parsedRemovedVideos) {
      const fullPath = path.join(process.cwd(), "public", vidPath.replace(/^\/+/, ""));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log("🧹 Deleted video:", fullPath);
      }
    }

    // =============================
    // 🧩 DB доторх images/videos array-с устгах
    // =============================
    if (parsedRemovedImages.length > 0) {
      await File.updateMany(
        { resortsId: id },
        { $pull: { images: { $in: parsedRemovedImages } } }
      );
    }

    if (parsedRemovedVideos.length > 0) {
      await File.updateMany(
        { resortsId: id },
        { $pull: { videos: { $in: parsedRemovedVideos } } }
      );
    }

    // =============================
    // 🧩 Шинэ зураг болон бичлэг нэмэх
    // =============================
    console.log("req.files:", req.files);

    // --- шинэ зураг ---
    if (req.files && req.files.images) {
      const images =
        req.files.images.map((f) => `/uploads/resorts/${f.filename}`) || [];
      console.log("📸 New images:", images);

      await File.updateOne(
        { resortsId: resort._id },
        { $push: { images: { $each: images } } },
        { upsert: true } // File бичлэг байхгүй бол үүсгэнэ
      );
    }

    // --- шинэ бичлэг ---
    if (req.files && req.files.videos) {
      const videos =
        req.files.videos.map((f) => `/uploads/resorts/${f.filename}`) || [];
      console.log("🎥 New videos:", videos);

      await File.updateOne(
        { resortsId: resort._id },
        { $push: { videos: { $each: videos } } },
        { upsert: true }
      );
    }

    // =============================
    // 🧹 Хоосон file бичлэг устгах
    // =============================
    await File.deleteMany({
      resortsId: id,
      $and: [
        { images: { $size: 0 } },
        { videos: { $size: 0 } },
      ],
    });

    // =============================
    // ✅ Амжилттай хариу буцаах
    // =============================
    const files = await File.find({ resortsId: resort._id });
    res.json({
      success: true,
      message: "✅ Resort зураг болон бичлэг амжилттай шинэчлэгдлээ!",
      resort,
      files,
    });

  } catch (err) {
    console.error("❌ Resort шинэчлэхэд алдаа:", err);
    res.status(500).json({ message: err.message });
  }
};


// ============================================
// ✅ DELETE Resort + related files
// ============================================
export const deleteResort = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Resort байгаа эсэхийг шалгах
    const resort = await Resort.findById(id);
    if (!resort) {
      return res.status(404).json({ success: false, message: "Resort олдсонгүй" });
    }

    // 2️⃣ Холбогдсон File бичлэгүүдийг олох
    const files = await File.find({ resortsId: id });

    // 3️⃣ File бүрийн images болон videos устгах
    for (const file of files) {
      if (file.images && file.images.length > 0) {
        for (const imgPath of file.images) {
          const fullPath = path.join(process.cwd(), "public", imgPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log("🗑️ Устгасан зураг:", imgPath);
          }
        }
      }

      if (file.videos && file.videos.length > 0) {
        for (const vidPath of file.videos) {
          const fullPath = path.join(process.cwd(), "public", vidPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log("🗑️ Устгасан бичлэг:", vidPath);
          }
        }
      }
    }

    // 4️⃣ File бичлэгүүдийг DB-ээс устгах
    await File.deleteMany({ resortsId: id });
    console.log("🧹 File хүснэгтээс холбогдсон бичлэгүүдийг устгалаа");

    // 5️⃣ Resort-г устгах
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