import { Enums } from "../utils/index.js";
import { TokenModel } from "../models/index.js";

export async function find(req, res) {
  try {
    const { token: givenToken } = req.params;
    const token = await TokenModel.findOne({
      token: givenToken,
      expiresAt: { $lt: Date.now },
    });
    if (token) {
      return res.status(200).json({
        status: Enums.Status.SUCCESS,
        payload: true,
        message: "Token found",
      });
    }
    return res.status(200).json({
      status: Enums.Status.NOTFOUND,
      payload: false,
      message: "Token invalid or expired",
    });
  } catch (err) {
    res.status(200).json({
      status: Enums.Status.ERROR,
      payload: false,
      message: err.message,
    });
  }
}
