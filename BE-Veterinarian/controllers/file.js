import path from "path";
import mongoose from "mongoose";
import { Enums } from "../utils/index.js";
import { PetModel } from "../models/index.js";

export async function download(req, res) {
  try {
    const { id, petId } = req.params;
    const pet = await PetModel.findOne(
      { _id: petId },
      {
        files: { $elemMatch: { _id: mongoose.Types.ObjectId(id) } },
      }
    );
    const file = pet.files[0];
    if (!file) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res.download(path.join("uploads", file.filename), file.originalName);
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function upload(req, res) {
  try {
    const { file } = req;
    const { id, petId } = req.params;
    const pet = await PetModel.findByIdAndUpdate(
      petId,
      {
        $addToSet: {
          files: {
            appointment: mongoose.Types.ObjectId(id),
            filename: file.filename,
            originalName: file.originalname,
            contentType: file.mimetype,
            size: file.size,
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

export async function deleteFile(req, res) {
  try {
    const { id, petId } = req.params;
    const pet = await PetModel.findByIdAndUpdate(
      petId,
      { $pull: { files: { _id: mongoose.Types.ObjectId(id) } } },
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
