import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use MongoDB Atlas connection string from .env or local MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/contentmagic';
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  App will continue with in-memory storage');
    console.log('💡 To use database: Add MONGODB_URI to .env file');
  }
};

export default connectDB;
