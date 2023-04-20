import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.DATABASE_URL as string;

// Connect to the MongoDB database
const connectToMongoDB = async () => {
  const conn = await mongoose.connect(MONGO_URL);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

export default connectToMongoDB;
