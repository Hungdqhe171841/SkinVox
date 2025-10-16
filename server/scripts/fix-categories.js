const mongoose = require('mongoose');
require('dotenv').config();

async function fixCategories() {
  try {
    console.log('🔧 Fixing categories collection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');
    console.log('✅ Connected to MongoDB');

    // Get the categories collection
    const db = mongoose.connection.db;
    const categoriesCollection = db.collection('categories');

    // Drop the unique index on slug
    try {
      await categoriesCollection.dropIndex('slug_1');
      console.log('✅ Dropped unique index on slug field');
    } catch (error) {
      console.log('ℹ️ No unique index found on slug field');
    }

    // Drop the entire categories collection to start fresh
    await categoriesCollection.drop();
    console.log('✅ Dropped categories collection');

    console.log('🎉 Categories collection fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing categories collection:', error);
    process.exit(1);
  }
}

// Run the fix function
fixCategories();
