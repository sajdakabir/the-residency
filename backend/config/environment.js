import dotenv from 'dotenv';
dotenv.config();

const getJwtSecret = () => {
  // Check if JWT_SECRET is set in environment variables
  if (process.env.JWT_SECRET) {
    // Log a warning indicating potential security risk
    console.warn("JWT_SECRET found in environment variables. This is discouraged for production. Consider using a more secure secret storage mechanism.");
    return process.env.JWT_SECRET;
  } else {
    // Fallback to a less secure default if JWT_SECRET is not set (for development purposes only)
    console.warn("JWT_SECRET not found in environment variables. Using a less secure default.  Do NOT use this in production.");
    return 'default-secret-for-development-only'; // Replace with a stronger mechanism for generating a secret in production
  }
};


export const environment = {
  MONGO_URI:process.env.MONGO_URI,
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE || '30d',
  JWT_SECRET: getJwtSecret(), // Use the function to retrieve the secret
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
};