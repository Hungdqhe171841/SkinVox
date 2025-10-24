const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function syncDatabaseWithFiles() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox';
    await mongoose.connect(mongoURI, { dbName: 'SkinVox' });
    console.log('✅ Connected to MongoDB');

    // Get all files in admin uploads directory
    const adminUploadsDir = path.join(__dirname, '../public/uploads/admins/admin/blogs');
    const files = fs.readdirSync(adminUploadsDir).filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );
    
    console.log('📁 Files in admin uploads directory:', files);

    // Find blogs with admin image paths
    const blogs = await Blog.find({ 
      images: { $regex: /\/uploads\/admins\// }
    });

    console.log(`📊 Found ${blogs.length} blogs with admin image paths`);

    for (const blog of blogs) {
      console.log(`\n📝 Blog: ${blog.title}`);
      console.log(`📝 Current images:`, blog.images);

      // Update images to use existing files
      const updatedImages = files.map(file => `/uploads/admins/admin/blogs/${file}`);
      
      // Update blog in database
      await Blog.findByIdAndUpdate(blog._id, { images: updatedImages });
      
      console.log(`✅ Updated images to:`, updatedImages);
    }

    console.log('\n✅ Database sync completed!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

syncDatabaseWithFiles();
