import express from "express";
import {
  getResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort,
} from "../controllers/resortController.js";

const router = express.Router();

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
    const resort = new Resort({
      ...req.body,
      images: req.files.map((file) => file.path),
      status: "pending", // explicitly өгч болно
    });

    await resort.save();
    res.status(201).json({ message: "Submitted for review" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
