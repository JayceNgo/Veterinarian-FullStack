import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { db, env } from "../config/index.js";
import {
  AppointmentRoute,
  AuthRoute,
  FileRoute,
  MedicationRoute,
  MessageRoute,
  PetRoute,
  TokenRoute,
  TreatmentRoute,
  UserRoute,
  VaccineRoute,
} from "../routes/index.js";

const app = express();
const database = db();

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(","),
  })
);
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));

app.use("/auth", AuthRoute);
app.use("/appointment", AppointmentRoute);
app.use("/file", FileRoute);
app.use("/medication", MedicationRoute);
app.use("/message", MessageRoute);
app.use("/pet", PetRoute);
app.use("/token", TokenRoute);
app.use("/treatment", TreatmentRoute);
app.use("/user", UserRoute);
app.use("/vaccine", VaccineRoute);

export default app;
