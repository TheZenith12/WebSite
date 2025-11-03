// routes/fileRoutes.js
import express from "express";
import { uploadFile, createResort, getFiles, deleteFile} from "../controllers/fileController.js";
import  upload  from "../middleware/upload.js";

const router = express.Router();

router.get("/files", getFiles);
router.post("/upload", upload.single("file"), uploadFile);
router.post("/new", upload.fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 10 }
]), 
createResort);
router.delete("/:id", deleteFile);

export default router;
