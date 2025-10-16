const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');
require('dotenv').config();

const sampleBlogs = [
  {
    title: "10 Essential Skincare Tips for Glowing Skin",
    content: "Achieving glowing skin doesn't have to be complicated. Here are 10 essential skincare tips that will help you maintain healthy, radiant skin. From proper cleansing routines to the importance of sunscreen, these tips will transform your skincare game...",
    excerpt: "Discover the essential skincare tips that will help you achieve that coveted glowing skin. From cleansing to protection, we cover everything you need to know.",
    featuredImage: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800",
    category: "skincare",
    tags: ["skincare", "beauty", "glowing-skin", "tips"],
    status: "published",
    isFeatured: true,
    seoTitle: "10 Essential Skincare Tips for Glowing Skin | SkinVox",
    seoDescription: "Learn the 10 essential skincare tips for achieving glowing, healthy skin. Expert advice on skincare routines, products, and techniques."
  },
  {
    title: "Complete Makeup Tutorial: Natural Glam Look",
    content: "Learn how to create a stunning natural glam look with this step-by-step makeup tutorial. We'll cover everything from foundation application to eye makeup techniques that will make you look effortlessly beautiful...",
    excerpt: "Master the art of natural glam makeup with our comprehensive tutorial. Perfect for everyday wear or special occasions.",
    featuredImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
    category: "makeup",
    tags: ["makeup", "tutorial", "natural-glam", "beauty"],
    status: "published",
    isFeatured: false,
    seoTitle: "Natural Glam Makeup Tutorial | Complete Guide",
    seoDescription: "Step-by-step natural glam makeup tutorial. Learn professional techniques for a flawless, everyday glam look."
  },
  {
    title: "Best Beauty Products for Sensitive Skin",
    content: "Finding the right beauty products for sensitive skin can be challenging. In this comprehensive guide, we review the best products that are gentle yet effective for sensitive skin types...",
    excerpt: "Discover the best beauty products specifically formulated for sensitive skin. Gentle, effective, and dermatologist-approved recommendations.",
    featuredImage: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800",
    category: "product-review",
    tags: ["sensitive-skin", "product-review", "beauty", "skincare"],
    status: "published",
    isFeatured: true,
    seoTitle: "Best Beauty Products for Sensitive Skin 2024",
    seoDescription: "Top-rated beauty products for sensitive skin. Gentle, effective, and dermatologist-tested products for your skincare routine."
  },
  {
    title: "DIY Face Masks for Different Skin Types",
    content: "Create your own face masks at home using natural ingredients. This guide covers different recipes for various skin types including oily, dry, combination, and sensitive skin...",
    excerpt: "Learn to make effective DIY face masks for your specific skin type using natural, kitchen-friendly ingredients.",
    featuredImage: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",
    category: "beauty-tips",
    tags: ["diy", "face-masks", "natural-beauty", "skincare"],
    status: "draft",
    isFeatured: false,
    seoTitle: "DIY Face Masks for Every Skin Type | Natural Recipes",
    seoDescription: "Easy DIY face mask recipes for different skin types. Natural ingredients for glowing, healthy skin at home."
  },
  {
    title: "How to Choose the Right Foundation Shade",
    content: "Selecting the perfect foundation shade can be overwhelming with so many options available. This guide will help you find your perfect match and avoid common foundation mistakes...",
    excerpt: "Master the art of foundation selection with our comprehensive guide. Find your perfect shade and application technique.",
    featuredImage: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800",
    category: "tutorial",
    tags: ["foundation", "makeup", "tutorial", "beauty-tips"],
    status: "published",
    isFeatured: false,
    seoTitle: "How to Choose the Right Foundation Shade | Complete Guide",
    seoDescription: "Learn how to choose the perfect foundation shade for your skin tone. Expert tips and tricks for flawless foundation application."
  }
];

async function seedBlogData() {
  try {
    console.log('🌱 Starting blog data seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');
    console.log('✅ Connected to MongoDB');

    // Find an admin user to be the author
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    console.log(`👤 Using admin user: ${adminUser.username}`);

    // Clear existing blogs (optional)
    await Blog.deleteMany({});
    console.log('🗑️ Cleared existing blogs');

    // Create sample blogs
    const blogsWithAuthor = sampleBlogs.map(blog => ({
      ...blog,
      author: adminUser._id
    }));

    const createdBlogs = await Blog.insertMany(blogsWithAuthor);
    console.log(`✅ Created ${createdBlogs.length} sample blogs`);

    // Display created blogs
    console.log('\n📝 Created blogs:');
    createdBlogs.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title} (${blog.status})`);
    });

    console.log('\n🎉 Blog data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding blog data:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedBlogData();
