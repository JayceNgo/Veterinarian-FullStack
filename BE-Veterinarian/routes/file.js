import express from "express";
import { File } from "../middlewares/index.js";
import { FileController } from "../controllers/index.js";

const router = express.Router();

router.get("/download/:id/:petId", FileController.download);
router.post(
  "/upload/:id/:petId",
  File.upload.single("file"),
  FileController.upload
);
router.delete("/delete/:id/:petId", FileController.deleteFile);

export default router;
