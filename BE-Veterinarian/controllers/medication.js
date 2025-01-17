import mongoose from "mongoose";
import { Enums } from "../utils/index.js";
import { PetModel } from "../models/index.js";

export async function findMedication(req, res) {
  try {
    const { id, petId, medicationId } = req.params;
    const pet = await PetModel.findOneAndUpdate(
      {
        _id: petId,
        "treatments._id": id,
        "treatments.medications._id": medicationId,
      },
      { "treatments._id": 1, "treatments.medications.$": 1 }
    );
    const medication = pet?.treatments[0]?.medications[0];
    if (!medication) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res.status(200).json({ status: Enums.Status.SUCCESS, payload: medication });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function createMedication(req, res) {
  try {
    const { id, petId } = req.params;
    const pet = await PetModel.findOneAndUpdate(
      { _id: petId, "treatments._id": id },
      { $push: { "treatments.$.medications": req.body } },
      { new: true }
    );
    if (!pet) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res.status(200).json({
      status: Enums.Status.SUCCESS,
      payload: pet,
    });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function updateMedication(req, res) {
  try {
    const { id, petId, medicationId } = req.params;
    const pet = await PetModel.findOneAndUpdate(
      {
        _id: petId,
        "treatments._id": id,
        "treatments.medications._id": medicationId,
      },
      {
        $set: { "treatments.$[treatment].medications.$[medication]": req.body },
      },
      {
        arrayFilters: [
          { "treatment._id": id },
          { "medication._id": medicationId },
        ],
      }
    );
    if (!pet) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res.status(200).json({
      status: Enums.Status.SUCCESS,
      payload: pet,
    });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function deleteMedication(req, res) {
  try {
    const { id, petId, medicationId } = req.params;
    const pet = await PetModel.findOneAndUpdate(
      { _id: petId, "treatments._id": id },
      { $pull: { "treatments.$.medications": { _id: medicationId } } },
      { new: true }
    );
    if (!pet) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res.status(200).json({
      status: Enums.Status.SUCCESS,
      payload: pet,
    });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function createDosage(req, res) {
  try {
    const { id, petId, medicationId } = req.params;
    const pet = await PetModel.findOneAndUpdate(
      {
        _id: petId,
        "treatments._id": id,
        "treatments.medications._id": medicationId,
      },
      {
        $push: {
          "treatments.$[treatment].medications.$[medication].dosages": {
            administeredAt: new Date(),
          },
        },
      },
      {
        arrayFilters: [
          { "treatment._id": id },
          { "medication._id": medicationId },
        ],
      }
    );
    if (!pet) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res.status(200).json({
      status: Enums.Status.SUCCESS,
      payload: pet,
    });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function deleteDosage(req, res) {
  try {
    const { id, petId, medicationId, dosageId } = req.params;
    const pet = await PetModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(petId),
        "treatments._id": mongoose.Types.ObjectId(id),
        "treatments.medications._id": mongoose.Types.ObjectId(medicationId),
      },
      {
        $pull: {
          "treatments.$[t].medications.$[m].dosages": {
            _id: mongoose.Types.ObjectId(dosageId),
          },
        },
      },
      {
        arrayFilters: [
          { "t._id": mongoose.Types.ObjectId(id) },
          { "m._id": mongoose.Types.ObjectId(medicationId) },
        ],
        new: true,
      }
    );
    if (!pet) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res.status(200).json({
      status: Enums.Status.SUCCESS,
      payload: pet,
    });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}
