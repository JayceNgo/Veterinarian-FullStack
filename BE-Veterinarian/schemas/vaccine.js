import mongoose from "mongoose";

const VaccineSchema = new mongoose.Schema({
  vaccineName: { type: String, required: true },
  givenAt: { type: Date, default: Date.now, required: true },
  nextAt: { type: Date, required: false },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: "Veterinarian" },
  notes: { type: String },
});

export { VaccineSchema };
