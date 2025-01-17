import path from "path";
import mongoose from "mongoose";
import { Enums } from "../utils/index.js";
import { PetModel, VeterinarianModel } from "../models/index.js";

export async function createVaccine(req, res) {
  try {
    const { id, petId } = req.params;
    const veterinarian = await VeterinarianModel.findOne({
      user: mongoose.Types.ObjectId(id),
    });
    if (!veterinarian) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    const pet = await PetModel.findByIdAndUpdate(
      petId,
      {
        $addToSet: {
          vaccines: { ...req.body, veterinarian: veterinarian._id },
        },
      },
      { new: true }
    );
    if (!pet) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res.status(200).json({ status: Enums.Status.SUCCESS, payload: pet });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function deleteVaccine(req, res) {
  try {
    const { id, petId } = req.params;
    const pet = await PetModel.findByIdAndUpdate(
      petId,
      { $pull: { vaccines: { _id: mongoose.Types.ObjectId(id) } } },
      { new: true }
    );
    if (!pet) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res.status(200).json({ status: Enums.Status.SUCCESS });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}
