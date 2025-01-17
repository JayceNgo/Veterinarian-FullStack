import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    collection: "messages",
  }
);

const MessageModel = mongoose.model("Message", MessageSchema);

export { MessageModel, MessageSchema };
