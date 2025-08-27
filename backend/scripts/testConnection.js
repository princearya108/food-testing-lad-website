const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    // Try multiple URI formats with DNS alternatives
    const uris = [
      'mongodb+srv://princetech:Prince%402005@cluster0.vvpkt.mongodb.net/food_testing_lab?retryWrites=true&w=majority&serverSelectionTimeoutMS=5000',
      'mongodb://princetech:Prince%402005@cluster0-shard-00-00.vvpkt.mongodb.net:27017,cluster0-shard-00-01.vvpkt.mongodb.net:27017,cluster0-shard-00-02.vvpkt.mongodb.net:27017/food_testing_lab?ssl=true&replicaSet=atlas-123abc-shard-0&authSource=admin&retryWrites=true&w=majority',
      'mongodb://localhost:27017/food_testing_lab' // Local fallback
    ];
    
    for (let i = 0; i < uris.length; i++) {
      if (!uris[i]) continue;
      
      try {
        console.log(`Trying connection ${i + 1}...`);
        await mongoose.connect(uris[i], {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000 // 5 second timeout
        });
        
        console.log('✅ MongoDB connected successfully!');
        console.log('📊 Database:', mongoose.connection.db.databaseName);
        console.log('🔗 Host:', mongoose.connection.host);
        
        // Test basic operations
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Collections found:', collections.map(c => c.name));
        
        mongoose.connection.close();
        return true;
        
      } catch (error) {
        console.log(`❌ Connection ${i + 1} failed:`, error.message);
        if (mongoose.connection.readyState !== 0) {
          mongoose.connection.close();
        }
      }
    }
    
    console.log('❌ All connection attempts failed');
    return false;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
};

if (require.main === module) {
  testConnection().then(() => process.exit(0));
}

module.exports = { testConnection };
