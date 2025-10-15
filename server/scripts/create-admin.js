require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdmin() {
  try {
    console.log('👑 Creating admin user...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');
    console.log('✅ Connected to MongoDB');
    
    // Create admin user
    const adminData = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin'
    };
    
    console.log('📝 Admin data:', adminData);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [{ email: adminData.email }, { username: adminData.username }]
    });
    
    if (existingAdmin) {
      console.log('⚠️ Admin already exists:', {
        username: existingAdmin.username,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      return;
    }
    
    // Create new admin
    const admin = new User(adminData);
    await admin.save();
    
    console.log('✅ Admin created successfully:', {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    });
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    console.log('🎉 Admin created! You can now login with:');
    console.log('📧 Email: admin@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: admin');
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
