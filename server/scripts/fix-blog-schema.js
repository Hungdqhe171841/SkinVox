const mongoose = require('mongoose');
require('dotenv').config();

async function fixBlogSchema() {
  try {
    console.log('🔧 Fixing blog schema...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');
    console.log('✅ Connected to MongoDB');

    // Get the blogs collection
    const db = mongoose.connection.db;
    const blogsCollection = db.collection('blogs');

    // Drop the unique index on slug
    try {
      await blogsCollection.dropIndex('slug_1');
      console.log('✅ Dropped unique index on slug field');
    } catch (error) {
      console.log('ℹ️ No unique index found on slug field');
    }

    // Drop the entire blogs collection to start fresh
    await blogsCollection.drop();
    console.log('✅ Dropped blogs collection');

    console.log('🎉 Blog schema fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing blog schema:', error);
    process.exit(1);
  }
}

// Run the fix function
fixBlogSchema();
