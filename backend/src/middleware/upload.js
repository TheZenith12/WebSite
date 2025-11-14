import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary тохиргоо
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Vercel-д зөв ажиллах storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "resorts";
    if (file.mimetype.startsWith("video")) folder = "resorts/videos";
    return {
      folder,
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

// Multer upload middleware
const upload = multer({ storage });

export default upload;
