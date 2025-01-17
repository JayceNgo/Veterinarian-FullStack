import { MessageModel } from "../models/index.js";
import { Enums } from "../utils/index.js";

export async function findOwnerDiscussions(req, res) {
  try {
    await MessageModel.find({ parent: null })
      .populate([
        {
          path: "user",
        },
        {
          path: "replies",
        },
      ])
      .sort({ date: 1 })
      .exec((err, discussions) => {
        if (err) return;
        res.status(200).json({
          status: Enums.Status.SUCCESS,
          payload: discussions.filter(
            (item) => item.user.userType === Enums.UserType.PET_OWNER
          ),
          message: "Everything went well",
        });
      });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function findVeterinarianDiscussions(req, res) {
  try {
    await MessageModel.find({ parent: null })
      .populate([
        {
          path: "user",
        },
        {
          path: "pet",
        },
        {
          path: "replies",
        },
      ])
      .sort({ date: 1 })
      .exec((err, discussions) => {
        if (err) return;
        res.status(200).json({
          status: Enums.Status.SUCCESS,
          payload: discussions.filter(
            (item) => item.user.userType === Enums.UserType.VETERINARIAN
          ),
          message: "Everything went well",
        });
      });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function findMessage(req, res) {
  try {
    const { id } = req.params;
    await MessageModel.findById(id)
      .populate([
        {
          path: "user",
        },
        {
          path: "pet",
        },
        {
          path: "replies",
          populate: "replies",
        },
      ])
      .exec((err, messages) => {
        if (err) return;
        res.status(200).json({
          status: Enums.Status.SUCCESS,
          payload: messages,
          message: "Everything went well",
        });
      });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function createMessage(req, res) {
  try {
    const { parent } = req.body;
    const message = await MessageModel.create(req.body);
    if (!message) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    } else {
      if (parent) {
        await MessageModel.findByIdAndUpdate(
          parent,
          { $addToSet: { replies: message._id } },
          { new: true }
        );
      }
    }
    res.status(200).json({ status: Enums.Status.SUCCESS, payload: message });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function updateMessage(req, res) {
  try {
    const { id } = req.params;
    const message = await MessageModel.findByIdAndUpdate(
      { _id: id },
      { $set: { ...req.body } }
    );
    if (!message) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    }
    res.status(200).json({ status: Enums.Status.SUCCESS, payload: message });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}

export async function deleteMessage(req, res) {
  try {
    const { id } = req.params;
    const message = await MessageModel.findByIdAndDelete(id);
    if (!message) {
      return res.status(200).json({
        status: Enums.Status.NOTFOUND,
        payload: null,
        message: "Something went wrong",
      });
    } else {
      if (message.parent) {
        await MessageModel.findByIdAndUpdate(
          message.parent,
          { $pull: { replies: message._id } },
          { new: true }
        );
      }
    }
    res.status(200).json({ status: Enums.Status.SUCCESS, payload: message });
  } catch (err) {
    res.status(200).json({ status: Enums.Status.ERROR, message: err.message });
  }
}
