import express from "express";
import multer from "multer";
import {
  getResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort,
} from "../controllers/resortController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // backend/uploads/
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getResorts);
router.get("/:id", getResortById);

router.post(
  "/new",
  createResort
);

router.put(
  "/edit/:id",
  updateResort
);

router.delete("/:id", deleteResort);

router.post("/", upload.array("images"), async (req, res) => {
  try {
    res.json({
      message: "Upload OK",
      files: req.files,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
