import dotenv from "dotenv";
dotenv.config();

const conf = {
  PORT: process.env.PORT || "3000",
  HUBSPOT_API_KEY: process.env.PRIVATE_APP_TOKEN || "",
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || "",
  CORS_ORIGIN1: process.env.CORS_ORIGIN1 || "",
  CORS_ORIGIN2: process.env.CORS_ORIGIN2 || "",
  CORS_ORIGIN3: process.env.CORS_ORIGIN3 || "",
};

export default conf;
