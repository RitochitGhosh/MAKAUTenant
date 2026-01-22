import mongoose from 'mongoose';

let isConnected;

export const connectToDB = async () => {
  if (isConnected) {
    console.log('✅ Using cached MongoDB connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = db.connections[0].readyState === 1;

    if (isConnected) {
      console.log('✅ Connected to MongoDB');
    }

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};
