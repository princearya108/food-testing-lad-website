const mongoose = require('mongoose');

const connectDB = async () => {
  // Priority order: working URIs first for faster connection
  const mongoOptions = [
    // Working URI (from terminal logs showing successful connection)
    'mongodb+srv://princeaarya10008:FTLcutm%4010008@ftl.njzlo8f.mongodb.net/food_testing_lab?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000&socketTimeoutMS=45000&family=4',
    // Alternative working URIs with optimized settings
    'mongodb+srv://princeaarya10008:FTL123@ftl.njzlo8f.mongodb.net/food_testing_lab?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000&socketTimeoutMS=45000&family=4',
    'mongodb+srv://princeaarya10008:FTLcutm10008@ftl.njzlo8f.mongodb.net/food_testing_lab?authSource=admin&retryWrites=true&w=majority&serverSelectionTimeoutMS=5000&family=4',
    // Environment variable (if set)
    process.env.MONGODB_URI,
    // Other URIs as fallback
    'mongodb+srv://princetech:Prince%402005@cluster0.vvpkt.mongodb.net/food_testing_lab?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000&family=4',
    'mongodb://localhost:27017/food_testing_lab'
  ].filter(Boolean);
  
  for (let i = 0; i < mongoOptions.length; i++) {
    try {
      console.log(`🔄 Trying MongoDB connection ${i + 1}/${mongoOptions.length}...`);
      const conn = await mongoose.connect(mongoOptions[i], {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Faster timeout for quick retry
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        family: 4, // Use IPv4, skip trying IPv6
        retryWrites: true,
        maxPoolSize: 10, // Maintain up to 10 socket connections
      });
      
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Database: ${conn.connection.name}`);
      console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Connecting'}`);
      
      // Setup connection event listeners for monitoring
      conn.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      conn.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
      });

      conn.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });

      return; // Success, exit function
    } catch (error) {
      console.error(`❌ MongoDB connection ${i + 1} failed:`, error.message);
      if (i === mongoOptions.length - 1) {
        console.log('🚀 Starting server without database connection...');
        console.log('⚠️  Some features may not work without database');
        return; // Continue without database
      }
    }
  }
};

module.exports = connectDB;
