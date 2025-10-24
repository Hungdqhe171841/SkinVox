const mongoose = require('mongoose');
const Blog = require('../models/Blog');
require('dotenv').config();

async function checkImagePaths() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox';
    await mongoose.connect(mongoURI, { dbName: 'SkinVox' });
    console.log('✅ Connected to MongoDB');

    // Find all blogs with images
    const blogs = await Blog.find({ images: { $exists: true, $ne: [] } });
    console.log(`📊 Found ${blogs.length} blogs with images`);

    for (const blog of blogs) {
      console.log(`\n📝 Blog: ${blog.title}`);
      console.log(`📝 Blog ID: ${blog._id}`);
      console.log(`📝 Images:`, blog.images);

      // Check if images are accessible
      for (let i = 0; i < blog.images.length; i++) {
        const imagePath = blog.images[i];
        console.log(`📸 Image ${i + 1}: ${imagePath}`);

        // Check if it's a relative path or absolute URL
        if (imagePath.startsWith('/uploads/')) {
          console.log(`   ✅ Relative path format`);
        } else if (imagePath.startsWith('http')) {
          console.log(`   ✅ Absolute URL format`);
        } else {
          console.log(`   ❌ Unknown format`);
        }
      }
    }

    // Check for blogs with old image paths
    const oldPathBlogs = await Blog.find({ 
      images: { $regex: /\/uploads\/blogs\// }
    });
    
    if (oldPathBlogs.length > 0) {
      console.log(`\n⚠️  Found ${oldPathBlogs.length} blogs with old image paths:`);
      for (const blog of oldPathBlogs) {
        console.log(`📝 Blog: ${blog.title}`);
        console.log(`📝 Old paths:`, blog.images);
      }
    }

    // Check for blogs with admin image paths
    const adminPathBlogs = await Blog.find({ 
      images: { $regex: /\/uploads\/admins\// }
    });
    
    if (adminPathBlogs.length > 0) {
      console.log(`\n✅ Found ${adminPathBlogs.length} blogs with admin image paths:`);
      for (const blog of adminPathBlogs) {
        console.log(`📝 Blog: ${blog.title}`);
        console.log(`📝 Admin paths:`, blog.images);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

checkImagePaths();
