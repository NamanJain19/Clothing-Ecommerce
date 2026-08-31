const mongoose = require('mongoose');

/**
 * Connect to MongoDB database with graceful connection handling
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('MongoDB connection error: MONGODB_URI is not defined in environment variables');
      return;
    }

    const conn = await mongoose.connect(mongoURI);

    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // We avoid hard process.exit(1) in development if Mongo is not running locally,
    // but log a clear error to assist with local setup.
  }
};

module.exports = connectDB;
