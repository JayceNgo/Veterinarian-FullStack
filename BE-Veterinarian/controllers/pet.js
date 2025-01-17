import mongoose from "mongoose";
import { Enums } from "../utils/index.js";
import { PetModel, VeterinarianModel } from "../models/index.js";

export async function findPet(req, res) {
  try {
    const { id } = req.params;
    const pet = await PetModel.findById(id);
    if (!pet) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Pet not found",
      });
    }
    res.status(200).json({ status: Enums.Status.SUCCESS, payload: pet });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function createPet(req, res) {
  try {
    const pet = await PetModel.create(req.body);
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

export async function updatePet(req, res) {
  try {
    const { id } = req.params;
    const pet = await PetModel.findByIdAndUpdate(
      { _id: id },
      { $set: { ...req.body } }
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

export async function deletePet(req, res) {
  try {
    const { id } = req.params;
    const pet = await PetModel.findByIdAndDelete(id);
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

export async function viewPet(req, res) {
  try {
    const { id } = req.params;
    const pet = await PetModel.findById(id).populate([
      {
        path: "owner",
      },
      {
        path: "treatments",
        populate: "veterinarian",
      },
      {
        path: "veterinarians",
        populate: "user",
      },
      {
        path: "files",
        populate: [
          {
            path: "appointment",
            populate: "veterinarian",
          },
        ],
      },
      {
        path: "vaccines",
        populate: [{ path: "veterinarian", model: "Veterinarian" }],
      },
    ]);
    if (!pet) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Pet not found",
      });
    }
    res.status(200).json({ status: Enums.Status.SUCCESS, payload: pet });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function findByOwner(req, res) {
  try {
    const { id } = req.params;
    const pets = await PetModel.find({ owner: id }).populate([
      {
        path: "owner",
        select: "_id firstName lastName",
      },
      {
        path: "veterinarians",
        populate: "user",
      },
    ]);
    if (!pets) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: [],
        message: "Pets not found",
      });
    }
    res.status(200).json({ status: Enums.Status.SUCCESS, payload: pets });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function findByVeterinarian(req, res) {
  try {
    const { id } = req.params;
    const veterinarian = await VeterinarianModel.findOne({ user: id }).populate(
      [
        {
          path: "pets",
        },
      ]
    );
    if (!veterinarian) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: [],
        message: "Pets not found",
      });
    }
    res.status(200).json({
      status: Enums.Status.SUCCESS,
      payload: veterinarian?.pets ?? [],
    });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function sharePet(req, res) {
  try {
    const { userId, petId } = req.params;
    const veterinarian = await VeterinarianModel.findOne({
      user: mongoose.Types.ObjectId(userId),
    });
    if (veterinarian) {
      await VeterinarianModel.findByIdAndUpdate(
        veterinarian._id,
        { $addToSet: { pets: mongoose.Types.ObjectId(petId) } },
        { new: true }
      );
      await PetModel.findByIdAndUpdate(
        petId,
        { $addToSet: { veterinarians: veterinarian._id } },
        { new: true }
      );
    }
    res.status(200).json({ status: Enums.Status.SUCCESS });
  } catch (err) {
    console.log(err.message);
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function unsharePet(req, res) {
  try {
    const { veterinarianId, petId } = req.params;
    await VeterinarianModel.findByIdAndUpdate(
      veterinarianId,
      { $pull: { pets: mongoose.Types.ObjectId(petId) } },
      { new: true }
    );
    await PetModel.findByIdAndUpdate(
      petId,
      { $pull: { veterinarians: mongoose.Types.ObjectId(veterinarianId) } },
      { new: true }
    );
    res.status(200).json({ status: Enums.Status.SUCCESS });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}
