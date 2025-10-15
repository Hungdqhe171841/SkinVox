require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createUser() {
  try {
    console.log('👤 Creating new user...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');
    console.log('✅ Connected to MongoDB');
    
    // Create new user
    const userData = {
      username: 'testuser',
      email: 'testuser@gmail.com',
      password: 'testuser123',
      role: 'user'
    };
    
    console.log('📝 User data:', userData);
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }]
    });
    
    if (existingUser) {
      console.log('⚠️ User already exists:', {
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role
      });
      return;
    }
    
    // Create new user
    const user = new User(userData);
    await user.save();
    
    console.log('✅ User created successfully:', {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    console.log('🎉 User created! You can now login with:');
    console.log('📧 Email: testuser@gmail.com');
    console.log('🔑 Password: testuser123');
  } catch (error) {
    console.error('❌ Error creating user:', error);
    process.exit(1);
  }
}

createUser();
