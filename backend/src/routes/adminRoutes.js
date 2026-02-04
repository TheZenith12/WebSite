// routes/adminRoutes.js
import express from "express";
import { protect, verifyAdmin } from "../middleware/auth.js";
import {
  getResorts,
  createResort,
  updateResort,
  deleteResort
} from "../controllers/resortController.js";

const router = express.Router();

// 🔐 ЗӨВХӨН ЭНД
router.use(protect);

router.get("/resorts", protect, verifyAdmin, getResorts);
router.post("/resorts", protect, verifyAdmin, createResort);
router.put("/resorts/:id", protect, verifyAdmin, updateResort);
router.delete("/resorts/:id", protect, verifyAdmin, deleteResort);

export default router;
