import mongoose from "mongoose";
import { Enums } from "../utils/index.js";
import { UserModel, VeterinarianModel } from "../models/index.js";

export async function findVeterinarians(req, res) {
  try {
    const veterinarians = await VeterinarianModel.find({
      userType: "Veterinarian",
    }).populate([
      {
        path: "user",
        select: "_id firstName lastName",
      },
    ]);
    res
      .status(200)
      .json({ status: Enums.Status.SUCCESS, payload: veterinarians });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function findUsers(req, res) {
  try {
    const users = await UserModel.find().select("-salt -password");
    res.status(200).json({
      status: Enums.Status.SUCCESS,
      payload: users.map((user) => user.response()),
    });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function findUser(req, res) {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select("-salt -password");
    if (!user) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "User not found",
      });
    }
    res.status(200).json({ status: Enums.Status.SUCCESS, payload: user });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function createUser(req, res) {
  try {
    const { userType, address, specialty } = req.body;
    delete req.body.address;
    delete req.body.specialty;
    const user = await UserModel.create(req.body);
    if (!user) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    } else {
      if (userType === Enums.UserType.VETERINARIAN) {
        await VeterinarianModel.create({
          address,
          specialty,
          user: user._id,
        });
      }
    }
    res.status(200).json({ status: Enums.Status.SUCCESS, payload: user });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndUpdate(
      { _id: id },
      { $set: { ...req.body } }
    );
    if (!user) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res.status(200).json({ status: Enums.Status.SUCCESS, payload: user });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.status(200).json({ status: Enums.Status.SUCCESS });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function searchVet(req, res) {
  const { searchQuery } = req.query;

  try {
    const vets = await VeterinarianModel.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
        { specialty: { $regex: searchQuery, $options: "i" } },
      ],
    });
    res.json(vets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
