import express from "express";
import { AuthController } from "../controllers/index.js";

const router = express.Router();

router.post("/sign-in", AuthController.signin);
router.post("/sign-up/pet-owner", AuthController.signupPetOwner);
router.post("/sign-up/veterinarian", AuthController.signupVeterinarian);
router.post("/forgot-password", AuthController.forgotPassword);
router.patch("/reset-password", AuthController.resetPassword);

export default router;
