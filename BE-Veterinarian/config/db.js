import mongoose from "mongoose";
import { env } from "../config/index.js";

export default async function () {
  await mongoose.connect(env.MONGODB_URI, (error) => {
    if (error) console.log(error);
    console.log("mongodb connection success");
  });
  mongoose.connection.on(
    "error",
    console.error.bind(console, "mongodb connection error")
  );
}
