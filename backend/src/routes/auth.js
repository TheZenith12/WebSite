import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  addResort,
  updateResort,
  getResorts,
} from "../controllers/resortController.js";

const router = express.Router();

router.get("/resorts", authMiddleware, getResorts);
router.post("/resorts/add", authMiddleware, addResort);
router.put("/resorts/edit/:id", authMiddleware, updateResort);

export default router;
