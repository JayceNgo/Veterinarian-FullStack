import express from "express";
import { PetController } from "../controllers/index.js";

const router = express.Router();

router.get("/find/:id", PetController.findPet);
router.post("/", PetController.createPet);
router.put("/update/:id", PetController.updatePet);
router.delete("/delete/:id", PetController.deletePet);

router.get("/view/:id", PetController.viewPet);
router.get("/owner/:id", PetController.findByOwner);
router.get("/veterinarian/:id", PetController.findByVeterinarian);
router.get("/share/:userId/:petId", PetController.sharePet);
router.get("/unshare/:veterinarianId/:petId", PetController.unsharePet);

export default router;
