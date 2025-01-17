import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email address",
      },
    },
    phone: {
      type: String,
      validate: {
        validator: function (value) {
          return /^\+?[1-9]\d{1,14}$/.test(value);
        },
        message: "Invalid phone number",
      },
    },
    password: {
      type: String,
      validate: {
        validator: function (value) {
          return value && value.length > 6;
        },
        message: "Password must be at least 6 characters long",
      },
    },
    userType: {
      type: String,
      enum: ["PetOwner", "Veterinarian"],
      required: true,
      default: "PetOwner",
    },
    salt: { type: String },
  },
  {
    collection: "users",
  }
);

UserSchema.pre("save", function (next) {
  if (this.password) {
    this.salt = Buffer.from(
      crypto.randomBytes(16).toString("base64"),
      "base64"
    );
    this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error("E-mail already in use"));
  } else {
    next(error);
  }
});

UserSchema.methods.hashPassword = function (password) {
  return crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("base64");
};

UserSchema.methods.response = function () {
  return {
    id: this._id,
    name: `${this.firstName} ${this.lastName}`,
    email: this.email,
    phone: this.phone,
    userType: this.userType,
  };
};

UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

UserSchema.set("toJSON", {
  getters: true,
  virtuals: true,
});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel, UserSchema };
