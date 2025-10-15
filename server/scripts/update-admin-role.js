require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function updateAdminRole() {
  try {
    console.log('👑 Updating admin role...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');
    console.log('✅ Connected to MongoDB');
    
    // Find admin user
    const admin = await User.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('📝 Current admin info:', {
      username: admin.username,
      email: admin.email,
      role: admin.role
    });
    
    // Update role to admin
    admin.role = 'admin';
    await admin.save();
    
    console.log('✅ Admin role updated successfully:', {
      username: admin.username,
      email: admin.email,
      role: admin.role
    });
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    console.log('🎉 Admin role updated! You can now login with:');
    console.log('📧 Email: admin@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: admin');
  } catch (error) {
    console.error('❌ Error updating admin role:', error);
    process.exit(1);
  }
}

updateAdminRole();
