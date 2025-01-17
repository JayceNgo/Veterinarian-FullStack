import mongoose from "mongoose";

const DosageSchema = new mongoose.Schema({
  administeredAt: { type: Date, default: Date.now },
});

export { DosageSchema };
