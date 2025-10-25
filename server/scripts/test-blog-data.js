require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skinvox';

async function testBlogData() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all blogs
    const blogs = await Blog.find({}).limit(5);
    console.log(`\n📝 Found ${blogs.length} blogs in database\n`);

    blogs.forEach((blog, index) => {
      console.log(`\n--- Blog ${index + 1} ---`);
      console.log('ID:', blog._id);
      console.log('Title:', blog.title);
      console.log('Category:', blog.category);
      console.log('Author:', blog.author);
      console.log('Status:', blog.status);
      console.log('Created At:', blog.createdAt);
      console.log('View Count:', blog.viewCount);
      console.log('Images:', blog.images);
      console.log('Tags:', blog.tags);
      console.log('Description:', blog.description?.substring(0, 100));
      console.log('Full document structure:', JSON.stringify(blog.toJSON(), null, 2));
    });

    // Check category distribution
    const categoryStats = await Blog.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log('\n📊 Category Distribution:');
    categoryStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} blogs`);
    });

    // Check status distribution
    const statusStats = await Blog.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log('\n📊 Status Distribution:');
    statusStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} blogs`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testBlogData();
