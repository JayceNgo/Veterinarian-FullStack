import mongoose from "mongoose";
import crypto from "crypto";

const TokenSchema = new mongoose.Schema(
  {
    token: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 60 * 60 * 1000);
      },
    },
  },
  {
    collection: "tokens",
  }
);

// TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

TokenSchema.pre("save", function (next) {
  const token = crypto.randomBytes(32).toString("hex");
  this.token = token;
  next();
});

const TokenModel = mongoose.model("Token", TokenSchema);

export { TokenModel, TokenSchema };
