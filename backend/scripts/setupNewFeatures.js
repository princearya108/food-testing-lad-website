const { createDefaultPages } = require('./createDefaultPages');
const { createDefaultInternships } = require('./createDefaultInternships');
const { createDefaultServices } = require('./createDefaultServices');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://princetech:<password>@cluster0.vvpkt.mongodb.net/food_testing_lab?retryWrites=true&w=majority';
    
    // URL encode the password if it contains special characters
    const encodedURI = MONGODB_URI.replace('<password>', encodeURIComponent('Prince@2005'));
    
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(encodedURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const setupNewFeatures = async () => {
  console.log('🚀 Setting up new admin panel features...\n');
  
  try {
    await connectDB();
    
    console.log('📄 Creating default pages...');
    await createDefaultPages();
    console.log('');
    
    console.log('🎓 Creating default internship programs...');
    await createDefaultInternships();
    console.log('');
    
    console.log('⚗️  Creating default lab services...');
    await createDefaultServices();
    console.log('');
    
    console.log('✅ All new features have been set up successfully!');
    console.log('');
    console.log('🎉 Your admin panel now includes:');
    console.log('   • Pages Management (Privacy Policy, Terms, etc.)');
    console.log('   • Internship Management (Create, edit, delete internship programs)');
    console.log('   • Service Management (Manage lab testing services)');
    console.log('');
    console.log('🔗 You can now access these features in the admin panel at:');
    console.log('   • Pages Management tab');
    console.log('   • Internship Management tab');
    console.log('   • Service Management tab');
    
  } catch (error) {
    console.error('❌ Error setting up new features:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔄 Database connection closed.');
  }
};

if (require.main === module) {
  setupNewFeatures();
}

module.exports = { setupNewFeatures };
