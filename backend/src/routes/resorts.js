import express from "express";
import {
  getResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort,
} from "../controllers/resortController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Routes
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
  "/edit/:id",
  upload.fields([
    { name: "images", maxCount: 20 },
    { name: "videos", maxCount: 20 },
  ]),
  updateResort
);

router.delete("/:id", deleteResort);

export default router;
