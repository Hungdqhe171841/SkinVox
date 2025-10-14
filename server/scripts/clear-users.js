require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function clearUsers() {
  try {
    console.log('🗑️  Clearing all users from database...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');
    console.log('✅ Connected to MongoDB');
    
    // Delete all users
    const result = await User.deleteMany({});
    console.log('✅ Deleted users:', result.deletedCount);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    console.log('🎉 Database cleared! You can now register new users.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearUsers();
