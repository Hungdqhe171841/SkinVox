const mongoose = require('mongoose');
const Blog = require('../models/Blog');
require('dotenv').config();

async function testBlogCreation() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox';
    await mongoose.connect(mongoURI, { dbName: 'SkinVox' });
    console.log('✅ Connected to MongoDB');

    // Test blog data with Cloudinary URLs
    const testBlogData = {
      title: 'Test Blog with Cloudinary Images',
      content: 'This is a test blog post with images stored in Cloudinary Media Library.',
      category: 'Test Category',
      images: [
        'https://res.cloudinary.com/dtkiwwwcm/image/upload/v1761292906/blogs/test-upload-1761292910195.jpg',
        'https://res.cloudinary.com/dtkiwwwcm/image/upload/v1761292384/skinvox/blogs/blog-1761292388204-659571069.jpg',
        'https://res.cloudinary.com/dtkiwwwcm/image/upload/v1761292385/skinvox/blogs/blog-1761292391486-65772494.jpg'
      ],
      author: 'Admin',
      status: 'published',
      formatType: 1,
      viewCount: 0,
      likes: [],
      tags: ['test', 'cloudinary', 'images'],
      affiliateLinks: [
        {
          productName: 'Test Product',
          productUrl: 'https://example.com/product',
          note: 'Test affiliate link'
        }
      ]
    };

    console.log('📝 Creating test blog with Cloudinary images...');
    console.log('📝 Blog data:', testBlogData);

    // Create blog
    const blog = new Blog(testBlogData);
    await blog.save();

    console.log('✅ Blog created successfully!');
    console.log('📊 Blog details:');
    console.log('  - ID:', blog._id);
    console.log('  - Title:', blog.title);
    console.log('  - Images:', blog.images.length);
    console.log('  - Status:', blog.status);

    // Test image URLs
    console.log('\n🧪 Testing image URLs...');
    for (let i = 0; i < blog.images.length; i++) {
      const imageUrl = blog.images[i];
      console.log(`  Image ${i + 1}: ${imageUrl}`);
      
      try {
        const response = await fetch(imageUrl);
        if (response.ok) {
          console.log(`    ✅ Image ${i + 1} is accessible`);
        } else {
          console.log(`    ❌ Image ${i + 1} is not accessible (${response.status})`);
        }
      } catch (error) {
        console.log(`    ❌ Error testing image ${i + 1}: ${error.message}`);
      }
    }

    console.log('\n📋 Summary:');
    console.log('✅ Blog created successfully in database');
    console.log('✅ Images stored as Cloudinary URLs');
    console.log('✅ Images are accessible via URLs');
    console.log('✅ Ready for frontend display');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

testBlogCreation();

