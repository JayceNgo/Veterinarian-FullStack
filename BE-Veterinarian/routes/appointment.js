import express from "express";
import { AppointmentController } from "../controllers/index.js";

const router = express.Router();

router.get("/find/:id", AppointmentController.findById);
router.get("/owner/:id", AppointmentController.findByPetOwner);
router.get("/check/:id/:date", AppointmentController.findByVeterinarianAndDate);
router.get(
  "/owner-two-weeks/:id",
  AppointmentController.findByPetOwnerTwoWeeks
);
router.get(
  "/veterinarian-two-weeks/:id",
  AppointmentController.findByVeterinarianTwoWeeks
);
router.post("/", AppointmentController.makeAppointment);
router.patch("/cancel/:id", AppointmentController.cancelAppointment);
router.patch("/update/:id", AppointmentController.updateAppointment);

export default router;
