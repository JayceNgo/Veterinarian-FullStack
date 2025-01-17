import express from "express";
import { MedicationController } from "../controllers/index.js";

const router = express.Router();

router.get("/:id/:petId/:medicationId", MedicationController.findMedication);
router.post("/:id/:petId", MedicationController.createMedication);
router.patch(
  "/update/:id/:petId/:medicationId",
  MedicationController.updateMedication
);
router.delete(
  "/delete/:id/:petId/:medicationId",
  MedicationController.deleteMedication
);
router.patch(
  "/add/:id/:petId/:medicationId",
  MedicationController.createDosage
);
router.delete(
  "/remove/:id/:petId/:medicationId/:dosageId",
  MedicationController.deleteDosage
);

export default router;
