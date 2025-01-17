import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  contentType: { type: String, required: false },
  size: { type: Number, required: false },
  uploadedAt: { type: Date, default: Date.now },
});

export { FileSchema };
