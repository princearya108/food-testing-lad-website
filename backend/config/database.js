const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MongoDB Atlas in production, local MongoDB in development
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ftl';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
