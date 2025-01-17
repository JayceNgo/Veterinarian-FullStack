import mongoose from "mongoose";
import { Enums } from "../utils/index.js";
import { PetModel, VeterinarianModel } from "../models/index.js";

export async function findTreatment(req, res) {
  try {
    const { id, petId } = req.params;
    const pet = await PetModel.findOne(
      { _id: petId },
      {
        treatments: { $elemMatch: { _id: mongoose.Types.ObjectId(id) } },
      }
    ).populate([
      {
        path: "treatments",
        populate: [
          {
            path: "veterinarian",
            populate: "user",
          },
        ],
      },
    ]);
    const treatment = pet.treatments[0];
    if (!treatment) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res.status(200).json({ status: Enums.Status.SUCCESS, payload: treatment });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function createTreatment(req, res) {
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
          treatments: {
            veterinarian: veterinarian._id,
            ...req.body,
          },
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

export async function completeTreatment(req, res) {
  try {
    const { id, petId } = req.params;
    const pet = await PetModel.findOneAndUpdate(
      {
        _id: petId,
        "treatments._id": id,
      },
      {
        $set: {
          "treatments.$.endDate": new Date(),
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

export async function deleteTreatment(req, res) {
  try {
    const { id, petId } = req.params;
    const pet = await PetModel.findByIdAndUpdate(
      petId,
      { $pull: { treatments: { _id: mongoose.Types.ObjectId(id) } } },
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
