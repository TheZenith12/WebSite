import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // uuid ашиглана
import {
  getResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort,
} from "../controllers/resortController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ===== Multer Config =====


// Upload тохиргоо
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/resorts");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});


// ===== Routes =====
router.get("/", getResorts);
router.get("/:id", getResortById);
router.post("/new",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  createResort
);
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  updateResort
);
router.delete("/:id", deleteResort);

export default router;
