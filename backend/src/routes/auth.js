import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getResorts,
  createResort,
  updateResort,
  deleteResort
} from "../controllers/resortController.js";

const router = express.Router();

// 🔐 БҮГД хамгаалагдана
router.use(protect);

router.get("/resorts", getResorts);
router.post("/resorts", createResort);
router.put("/resorts/:id", updateResort);
router.delete("/resorts/:id", deleteResort);

export default router;
