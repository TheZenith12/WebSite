import express from "express";
import { getResorts, getResortById } from "../controllers/resortController.js";

const router = express.Router();

router.get("/resorts", getResorts);
router.get("/resorts/:id", getResortById);

export default router;