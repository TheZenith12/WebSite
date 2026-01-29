import express from "express";
import { protect } from "../controllers/authController.js";
import {
  getResorts,
  addResort,
  updateResort,
  deleteResort
} from "../controllers/resortController.js";

const router = express.Router();

// 🔐 БҮГД хамгаалагдана
router.use(protect);

router.get("/resorts", getResorts);
router.post("/resorts", addResort);
router.put("/resorts/:id", updateResort);
router.delete("/resorts/:id", deleteResort);

export default router;
