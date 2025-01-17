import mongoose from "mongoose";

const VeterinarianSchema = new mongoose.Schema(
  {
    specialty: {
      type: String,
    },
    address: {
      type: String,
    },
    pets: [
      {
        ref: "Pet",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    user: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    collection: "veterinarians",
  }
);

const VeterinarianModel = mongoose.model("Veterinarian", VeterinarianSchema);

export { VeterinarianModel, VeterinarianSchema };
