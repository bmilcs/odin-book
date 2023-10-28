import {
  DEVELOPMENT_DB,
  MONGO_DB,
  NODE_ENV,
  PRODUCTION_DB,
} from "@/config/env";
import mongoose from "mongoose";

const connectDatabase = async () => {
  const dbName = NODE_ENV === "production" ? PRODUCTION_DB : DEVELOPMENT_DB;
  try {
    await mongoose.connect(MONGO_DB, {
      dbName,
    });
    console.log(`> db connected: "${dbName}"`);
  } catch (err) {
    console.error(`> db error: ${err}`);
    throw new Error("error connecting to database");
  }
};

export default connectDatabase;
