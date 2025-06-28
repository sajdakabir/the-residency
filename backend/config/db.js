import mongoose from 'mongoose';
import { environment } from './environment.js';


// Prefer value from environment.js, but gracefully fall back to process.env or a sensible local default
const MONGO_URI = environment.MONGO_URI || process.env.MONGO_URI ;
console.log(MONGO_URI);
const connectDB = async () => {
  try {

const conn = await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error: " + error.message);
    process.exit(1);
  }
};


export default connectDB;
