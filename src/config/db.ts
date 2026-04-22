import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn('⚠️ MONGODB_URI is not defined. Database features will not work.');
      console.warn('Please set MONGODB_URI in your project settings/secrets.');
      return;
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('IP not whitelisted')) {
      console.error('TIP: Make sure to allow access from "Everywhere" (0.0.0.0/0) in your MongoDB Atlas Network Access settings.');
    }
  }
};

export default connectDB;
