import express from "express";
import { TokenController } from "../controllers/index.js";

const router = express.Router();

router.get("/:token", TokenController.find);

export default router;
