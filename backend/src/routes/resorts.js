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
