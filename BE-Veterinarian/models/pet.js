import mongoose from "mongoose";
import { AppointmentSchema } from "../models/index.js";
import {
  FileSchema,
  VaccineSchema,
  TreatmentSchema,
} from "../schemas/index.js";

const PetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    breed: { type: String },
    species: { type: String, required: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Unknown"],
      required: true,
    },
    birthdate: { type: Date, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vaccines: { type: [VaccineSchema], default: [] },
    veterinarians: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Veterinarian" },
    ],
    treatments: { type: [TreatmentSchema], default: [] },
    files: { type: [FileSchema], default: [] },
    allergies: { type: String },
    notes: { type: String },
  },
  {
    collection: "pets",
  }
);

const PetModel = mongoose.model("Pet", PetSchema);

export { PetModel, PetSchema };
