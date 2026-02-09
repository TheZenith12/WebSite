import express from "express";
import {
  getResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort,
} from "../controllers/resortController.js";

const router = express.Router();

router.get("/", getResorts);
router.get("/:id", getResortById);

router.post(
  "/new",
  createResort
);

router.put(
  "/:id",
  updateResort
);

router.delete("/:id", deleteResort);

export default router;
