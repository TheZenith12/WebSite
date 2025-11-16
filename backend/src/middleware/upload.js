import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: isVideo ? "resorts/videos" : "resorts/images",
      resource_type: isVideo ? "video" : "image",
      allowed_formats: ["jpg","jpeg","png","webp","mp4","mov"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB хэрэв хэрэгтэй бол
});

export default upload;
