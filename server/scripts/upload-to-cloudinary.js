const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
require('dotenv').config();

async function uploadToCloudinary() {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: 'dtkiwwwcm',
      api_key: '277762621615142',
      api_secret: '82yyRtiNlkZCXOpf382tkqRj4bk'
    });

    console.log('🔍 Uploading images to Cloudinary...\n');

    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox';
    await mongoose.connect(mongoURI, { dbName: 'SkinVox' });
    console.log('✅ Connected to MongoDB');

    // Get all files in admin uploads directory
    const adminUploadsDir = path.join(__dirname, '../public/uploads/admins/admin/blogs');
    const files = fs.readdirSync(adminUploadsDir).filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );
    
    console.log('📁 Files to upload:', files);

    const uploadedUrls = [];

    // Upload each file to Cloudinary
    for (const file of files) {
      const filePath = path.join(adminUploadsDir, file);
      console.log(`\n📤 Uploading ${file}...`);

      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'skinvox/blogs',
          public_id: `blog-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
          resource_type: 'auto',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' }
          ]
        });

        console.log(`✅ Uploaded: ${result.secure_url}`);
        uploadedUrls.push(result.secure_url);

      } catch (error) {
        console.error(`❌ Error uploading ${file}:`, error.message);
      }
    }

    // Update database with Cloudinary URLs
    console.log('\n📊 Updating database with Cloudinary URLs...');
    
    const blogs = await Blog.find({ 
      images: { $regex: /\/uploads\/admins\// }
    });

    console.log(`📊 Found ${blogs.length} blogs to update`);

    for (const blog of blogs) {
      console.log(`\n📝 Updating blog: ${blog.title}`);
      console.log(`📝 Old images:`, blog.images);

      // Update with Cloudinary URLs
      await Blog.findByIdAndUpdate(blog._id, { images: uploadedUrls });
      
      console.log(`✅ Updated images to:`, uploadedUrls);
    }

    console.log('\n✅ Upload and database update completed!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

uploadToCloudinary();
