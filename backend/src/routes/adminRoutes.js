// routes/adminRoutes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getResorts,
  createResort,
  updateResort,
  deleteResort
} from "../controllers/resortController.js";
import { loginAdmin } from "../controllers/authController.js";

const router = express.Router();

// 🔐 ЗӨВХӨН ЭНД
router.use(protect);

router.post("/login", loginAdmin);
router.get("/resorts", getResorts);
router.post("/resorts", createResort);
router.put("/resorts/:id", updateResort);
router.delete("/resorts/:id", deleteResort);

export default router;
