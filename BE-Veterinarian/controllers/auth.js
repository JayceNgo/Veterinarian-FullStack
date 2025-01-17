import { Enums } from "../utils/index.js";
import { Mail } from "../services/index.js";
import { UserModel, VeterinarianModel, TokenModel } from "../models/index.js";

export async function signin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      const isAuthenticated = user.authenticate(password);
      if (isAuthenticated) {
        return res.status(200).json({
          status: Enums.Status.SUCCESS,
          payload: user.response(),
          message: "Login done successfully",
        });
      }
    }
    return res.status(200).json({
      status: Enums.Status.BADREQUEST,
      payload: null,
      message: "There is no user with the provided credentials",
    });
  } catch (err) {
    res.status(200).json({
      status: Enums.Status.ERROR,
      payload: err,
      message: err.message,
    });
  }
}

export async function signupPetOwner(req, res) {
  try {
    const { email } = req.body;
    delete req.body.address;
    delete req.body.specialty;
    const user = await UserModel.create(req.body);
    if (user) {
      return res.status(200).json({
        status: Enums.Status.SUCCESS,
        payload: user.response(),
        message: "User created successfully",
      });
    }
    return res.status(200).json({
      status: Enums.Status.BADREQUEST,
      payload: null,
      message: "User not created successfully",
    });
  } catch (err) {
    res.status(200).json({
      status: Enums.Status.ERROR,
      payload: err,
      message: err.message,
    });
  }
}

export async function signupVeterinarian(req, res) {
  try {
    const { email, address, specialty } = req.body;
    delete req.body.address;
    delete req.body.specialty;
    const user = await UserModel.create({
      ...req.body,
      userType: Enums.UserType.VETERINARIAN,
    });
    if (user) {
      await VeterinarianModel.create({
        address,
        specialty,
        user: user._id,
      });
      return res.status(200).json({
        status: Enums.Status.SUCCESS,
        payload: user.response(),
        message: "User created successfully",
      });
    }
    return res.status(200).json({
      status: Enums.Status.BADREQUEST,
      payload: null,
      message: "User not created successfully",
    });
  } catch (err) {
    res.status(200).json({
      status: Enums.Status.ERROR,
      payload: err,
      message: err.message,
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      const token = await TokenModel.create({ user: user._id });
      if (token) {
        const { status } = await Mail.forgetPassword(email, token.token);
        return res.status(200).json({
          status: Enums.Status.SUCCESS,
          payload: token,
          message: "An email has been sent",
        });
      }
    }
    return res.status(200).json({
      status: Enums.Status.NOTFOUND,
      payload: null,
      message: "User not found with the provided email",
    });
  } catch (err) {
    res.status(200).json({
      status: Enums.Status.ERROR,
      payload: err,
      message: err.message,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token: uniqueToken, password } = req.body;
    const token = await TokenModel.findOne({ token: uniqueToken }).populate(
      "user"
    );
    if (token) {
      const { user } = token;
      const newUser = await UserModel.findByIdAndUpdate(
        user._id,
        { $set: { password: user.hashPassword(password) } },
        { new: true }
      );
      await TokenModel.findByIdAndDelete(token._id);
      if (newUser) {
        return res.status(200).json({
          status: Enums.Status.SUCCESS,
          payload: newUser.response(),
          message: "Password updated successfully",
        });
      }
    }
    return res.status(200).json({
      status: Enums.Status.NOTFOUND,
      payload: null,
      message: "The password has not been updated",
    });
  } catch (err) {
    res.status(200).json({
      status: Enums.Status.ERROR,
      payload: err,
      message: err.message,
    });
  }
}
