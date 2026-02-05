import express from "express";
import { protect, verifyAdmin } from "../middleware/auth.js";
import {
  getResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort
} from "../controllers/resortController.js";

const router = express.Router();

router.use(protect, verifyAdmin);

router.route("/resorts")
  .get(getResorts)
  .post(createResort);

router.route("/resorts/:id")
  .get(getResortById)
  .put(updateResort)
  .delete(deleteResort);

export default router;