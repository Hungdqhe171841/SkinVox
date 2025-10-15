require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Category = require('../models/Category');
const Lipstick = require('../models/Lipstick');
const Eyeshadow = require('../models/Eyeshadow');
const Blush = require('../models/Blush');
const Eyebrows = require('../models/Eyebrows');
const Eyeliner = require('../models/Eyeliners');

async function seedData() {
  try {
    console.log('🌱 Seeding database with sample data...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');
    console.log('✅ Connected to MongoDB');
    
    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('❌ Admin user not found. Please create admin user first.');
      return;
    }
    
    // Create categories
    const categories = [
      { name: 'Lipstick', description: 'Son môi các loại', color: '#e91e63' },
      { name: 'Eyeshadow', description: 'Phấn mắt và palette', color: '#9c27b0' },
      { name: 'Blush', description: 'Phấn má và highlight', color: '#ff5722' },
      { name: 'Eyebrows', description: 'Kẻ lông mày', color: '#795548' },
      { name: 'Eyeliner', description: 'Kẻ mắt', color: '#607d8b' }
    ];
    
    console.log('📂 Creating categories...');
    for (const catData of categories) {
      const existingCategory = await Category.findOne({ name: catData.name });
      if (!existingCategory) {
        const category = new Category({
          ...catData,
          createdBy: admin._id
        });
        await category.save();
        console.log(`✅ Category "${catData.name}" created`);
      } else {
        console.log(`⚠️ Category "${catData.name}" already exists`);
      }
    }
    
    // Create sample products
    console.log('💄 Creating sample products...');
    
    // Lipsticks
    const lipsticks = [
      {
        name: 'Matte Red Lipstick',
        brand: 'SkinVox',
        color: 'Classic Red',
        price: 25.99,
        description: 'Long-lasting matte red lipstick with creamy texture',
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'],
        stock: 50,
        rating: 4.5,
        numReviews: 12
      },
      {
        name: 'Nude Pink Lipstick',
        brand: 'SkinVox',
        color: 'Nude Pink',
        price: 22.99,
        description: 'Natural nude pink lipstick for everyday wear',
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400'],
        stock: 30,
        rating: 4.2,
        numReviews: 8
      }
    ];
    
    for (const lipstickData of lipsticks) {
      const existingLipstick = await Lipstick.findOne({ name: lipstickData.name });
      if (!existingLipstick) {
        const lipstick = new Lipstick(lipstickData);
        await lipstick.save();
        console.log(`✅ Lipstick "${lipstickData.name}" created`);
      }
    }
    
    // Eyeshadows
    const eyeshadows = [
      {
        name: 'Neutral Palette',
        brand: 'SkinVox',
        palette: 'Everyday Neutrals',
        colors: [
          { name: 'Beige', hex: '#F5E6D3', finish: 'matte' },
          { name: 'Brown', hex: '#8B4513', finish: 'matte' },
          { name: 'Taupe', hex: '#B8A082', finish: 'satin' },
          { name: 'Cream', hex: '#FFFDD0', finish: 'shimmer' }
        ],
        finish: 'Matte',
        price: 35.99,
        description: 'Perfect neutral eyeshadow palette for everyday looks',
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400'],
        stock: 25,
        rating: 4.7,
        numReviews: 15
      }
    ];
    
    for (const eyeshadowData of eyeshadows) {
      const existingEyeshadow = await Eyeshadow.findOne({ name: eyeshadowData.name });
      if (!existingEyeshadow) {
        const eyeshadow = new Eyeshadow(eyeshadowData);
        await eyeshadow.save();
        console.log(`✅ Eyeshadow "${eyeshadowData.name}" created`);
      }
    }
    
    // Create sample blogs
    console.log('📝 Creating sample blogs...');
    const blogs = [
      {
        title: '10 Bước Chăm Sóc Da Buổi Sáng',
        content: 'Chăm sóc da buổi sáng là bước quan trọng để duy trì làn da khỏe mạnh. Hãy cùng SkinVox khám phá 10 bước chăm sóc da buổi sáng hiệu quả...',
        featuredImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
        category: 'skincare',
        tags: ['skincare', 'morning-routine', 'beauty-tips'],
        status: 'published',
        isFeatured: true
      },
      {
        title: 'Cách Chọn Son Môi Phù Hợp Với Tông Da',
        content: 'Việc chọn son môi phù hợp với tông da sẽ giúp bạn trông rạng rỡ và tự tin hơn. Hãy cùng tìm hiểu cách chọn son môi phù hợp...',
        featuredImage: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600',
        category: 'makeup',
        tags: ['lipstick', 'makeup-tips', 'color-matching'],
        status: 'published',
        isFeatured: true
      }
    ];
    
    for (const blogData of blogs) {
      const existingBlog = await Blog.findOne({ title: blogData.title });
      if (!existingBlog) {
        const blog = new Blog({
          ...blogData,
          author: admin._id
        });
        await blog.save();
        console.log(`✅ Blog "${blogData.title}" created`);
      }
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    console.log('🎉 Database seeded successfully!');
    console.log('📊 You can now test admin features with sample data.');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedData();
