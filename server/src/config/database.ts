import { DEVELOPMENT_DB, MONGO_DB, NODE_ENV, PRODUCTION_DB } from '@/config/env';
import mongoose from 'mongoose';

const connectDatabase = async () => {
  const dbName = NODE_ENV === 'production' ? PRODUCTION_DB : DEVELOPMENT_DB;
  try {
    await mongoose.connect(MONGO_DB, {
      dbName,
    });
    console.log(`> db connected: "${dbName}"`);
  } catch (err) {
    console.error(`> db error: "${dbName}"`);
    throw new Error(`Unable to connect to the database: ${err}`);
  }
};

export default connectDatabase;
