import mongoose from "mongoose";
import { Enums } from "../utils/index.js";
import { AppointmentModel, VeterinarianModel } from "../models/index.js";

export async function makeAppointment(req, res) {
  try {
    const appointment = await AppointmentModel.create(req.body);
    if (!appointment) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: [],
        message: "Something went wrong",
      });
    }
    res
      .status(200)
      .json({ status: Enums.Status.SUCCESS, payload: appointment });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function cancelAppointment(req, res) {
  try {
    const { id } = req.params;
    const appointment = await AppointmentModel.findByIdAndUpdate(id, {
      $set: { status: "Cancelled" },
    });
    if (!appointment) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res
      .status(200)
      .json({ status: Enums.Status.SUCCESS, payload: appointment });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const appointment = await AppointmentModel.findByIdAndUpdate(id, {
      $set: { ...req.body },
    });
    if (!appointment) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res
      .status(200)
      .json({ status: Enums.Status.SUCCESS, payload: appointment });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function findById(req, res) {
  try {
    const { id } = req.params;
    const appointment = await AppointmentModel.findById(id).populate([
      {
        path: "veterinarian",
        populate: "user",
      },
      {
        path: "pet",
        populate: [
          {
            path: "owner",
          },
          {
            path: "treatments",
            populate: "veterinarian",
          },
        ],
      },
    ]);
    if (!appointment) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Appointment not found",
      });
    }
    res.status(200).json({
      status: Enums.Status.SUCCESS,
      payload: appointment,
    });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function findByPetOwner(req, res) {
  try {
    const { id } = req.params;
    const appointments = await AppointmentModel.find()
      .populate({
        path: "pet",
        match: { owner: id },
        populate: "owner",
      })
      .populate({
        path: "veterinarian",
        populate: "user",
      })
      .sort({ date: 1 });
    res.status(200).json({
      status: Enums.Status.SUCCESS,
      payload: appointments?.filter((appointment) => appointment.pet) ?? [],
    });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function findByVeterinarianAndDate(req, res) {
  try {
    const { id, date } = req.params;
    const appointmentDate = new Date(date);
    const appointments = await AppointmentModel.find({
      $expr: {
        $eq: [
          { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          {
            $dateToString: { format: "%Y-%m-%d", date: appointmentDate },
          },
        ],
      },
      status: "Scheduled",
      veterinarian: mongoose.Types.ObjectId(id),
    });
    res
      .status(200)
      .json({ status: Enums.Status.SUCCESS, payload: appointments });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function findByPetOwnerTwoWeeks(req, res) {
  try {
    const { id } = req.params;
    const today = new Date();
    const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const appointments = await AppointmentModel.find({
      date: {
        $gte: today,
        $lte: twoWeeksLater,
      },
      status: "Scheduled",
    })
      .populate({
        path: "pet",
        match: { owner: id },
        populate: "owner",
      })
      .populate({
        path: "veterinarian",
        populate: "user",
      })
      .sort({ date: 1 });
    res.status(200).json({
      status: Enums.Status.SUCCESS,
      payload: appointments?.filter((appointment) => appointment.pet) ?? [],
    });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function findByVeterinarianTwoWeeks(req, res) {
  try {
    const { id } = req.params;
    const today = new Date();
    const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    const veterinarian = await VeterinarianModel.findOne({ user: id });
    const appointments = await AppointmentModel.find({
      date: {
        $lte: twoWeeksLater,
      },
      status: "Scheduled",
      veterinarian: veterinarian._id,
    }).populate([
      {
        path: "pet",
        populate: "owner",
      },
    ]);
    res
      .status(200)
      .json({ status: Enums.Status.SUCCESS, payload: appointments });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}
