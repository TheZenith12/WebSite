import express from "express";
import { protect, verifyAdmin } from "../middleware/auth.js";
import {
  getResorts,
  createResort,
  updateResort,
  deleteResort
} from "../controllers/resortController.js";

const router = express.Router();

// 🔐 admin token байхад л хангалттай
router.use(protect, verifyAdmin);

router.get("/resorts", getResorts);
router.post("/resorts", createResort);
router.put("/resorts/:id", updateResort);
router.delete("/resorts/:id", deleteResort);

export default router;
