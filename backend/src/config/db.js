const mongoose = require('mongoose');

const connectDB = async () => {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    error.message = `MongoDB connection failed: ${error.message}`;
    throw error;
  }
};

module.exports = connectDB;
