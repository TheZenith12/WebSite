import multer from "multer";
import path from "path";
import fs from "fs";

// 📁 Upload хадгалах зам
const uploadPath = "public/uploads/resorts"; // ✅ 'uploads' гэж бичих нь илүү зөв, нийтлэг

// 📂 Хэрвээ хавтас байхгүй бол автоматаар үүсгэнэ
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 Upload folder created:", uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// ✅ Ерөнхий upload (default export)
const upload = multer({ storage });

export default upload;
