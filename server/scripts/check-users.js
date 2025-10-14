require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');
    console.log('✅ Connected to MongoDB');
    
    // Find all users
    const users = await User.find({});
    console.log('📊 Total users found:', users.length);
    
    if (users.length > 0) {
      console.log('👥 Users in database:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
      });
      
      // Ask if user wants to delete all users
      console.log('\n🗑️  To clear all users, uncomment the delete section in this script');
      // await User.deleteMany({});
      // console.log('✅ All users deleted');
    } else {
      console.log('📭 No users found in database');
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUsers();
