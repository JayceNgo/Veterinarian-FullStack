import mongoose from "mongoose";

import { MedicationSchema } from "../schemas/index.js";

const TreatmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  medications: { type: [MedicationSchema], default: [] },
  veterinarian: { type: mongoose.Schema.Types.ObjectId, ref: "Veterinarian" },
  startDate: { type: Date, default: Date.now, required: true },
  endDate: { type: Date },
});

export { TreatmentSchema };
