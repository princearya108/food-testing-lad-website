const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/ftl', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Default admin already exists!');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
      return;
    }

    // Create default admin
    const defaultAdmin = new Admin({
      username: 'admin',
      email: 'admin@gtftl.com',
      password: 'admin123', // This will be hashed automatically
      role: 'super_admin'
    });

    await defaultAdmin.save();

    console.log('✅ Default admin created successfully!');
    console.log('📧 Email: admin@gtftl.com');
    console.log('👤 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('🛡️ Role: super_admin');
    console.log('');
    console.log('⚠️ IMPORTANT: Change the default password after first login!');
    console.log('🌐 Login at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
createDefaultAdmin();
