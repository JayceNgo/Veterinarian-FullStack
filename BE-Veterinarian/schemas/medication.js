import mongoose from "mongoose";

import { DosageSchema } from "../schemas/index.js";

const MedicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  unit: { type: String, required: true },
  interval: { type: String, required: true },
  dosages: { type: [DosageSchema], default: [] },
});

export { MedicationSchema };
