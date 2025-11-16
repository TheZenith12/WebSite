import express from "express";
import upload from "../middleware/upload.js"; // Cloudinary upload
import {
  getResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort,
} from "../controllers/resortController.js";

const router = express.Router();

router.get("/", getResorts);
router.get("/:id", getResortById);

router.post(
  "/new",
  upload.fields([
    { name: "images", maxCount: 20 },
    { name: "videos", maxCount: 20 },
  ]),
  createResort
);

router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 20 },
    { name: "videos", maxCount: 20 },
  ]),
  updateResort
);

router.delete("/:id", deleteResort);

export default router;
