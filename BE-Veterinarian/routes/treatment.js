import express from "express";
import { TreatmentController } from "../controllers/index.js";

const router = express.Router();

router.get("/:id/:petId", TreatmentController.findTreatment);
router.post("/:id/:petId", TreatmentController.createTreatment);
router.patch("/update/:id/:petId", TreatmentController.completeTreatment);
router.delete("/delete/:id/:petId", TreatmentController.deleteTreatment);

export default router;
