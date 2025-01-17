import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Veterinarian",
      required: true,
    },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    notes: { type: String },
  },
  {
    collection: "appointments",
  }
);

const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);

export { AppointmentModel, AppointmentSchema };
