import express from "express";
import { VaccineController } from "../controllers/index.js";

const router = express.Router();

router.post("/:id/:petId", VaccineController.createVaccine);
router.delete("/delete/:id/:petId", VaccineController.deleteVaccine);

export default router;
