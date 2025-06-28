import dotenv from 'dotenv';
dotenv.config();


export const environment = {
  MONGO_URI:process.env.MONGO_URI,
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
