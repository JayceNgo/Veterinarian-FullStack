import dotenv from "dotenv";

dotenv.config();

export default {
  CONNECTION_STRING: process.env.CONNECTION_STRING,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
};
