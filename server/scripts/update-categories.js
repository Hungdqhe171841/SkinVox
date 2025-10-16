const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const productCategories = [
  {
    name: "Son Môi",
    description: "Bộ sưu tập son môi đa dạng từ các thương hiệu cao cấp",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    icon: "💄",
    color: "#FF6B6B",
    sortOrder: 1,
    isActive: true
  },
  {
    name: "Phấn Mắt",
    description: "Bảng phấn mắt với nhiều màu sắc và kết cấu khác nhau",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400",
    icon: "👁️",
    color: "#4ECDC4",
    sortOrder: 2,
    isActive: true
  },
  {
    name: "Phấn Má",
    description: "Phấn má tạo độ hồng tự nhiên cho gương mặt",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    icon: "🌸",
    color: "#FFB6C1",
    sortOrder: 3,
    isActive: true
  },
  {
    name: "Chân Mày",
    description: "Sản phẩm trang điểm chân mày chuyên nghiệp",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    icon: "👁️‍🗨️",
    color: "#8B4513",
    sortOrder: 4,
    isActive: true
  },
  {
    name: "Bút Kẻ Mắt",
    description: "Bút kẻ mắt với nhiều loại và màu sắc đa dạng",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    icon: "✏️",
    color: "#000000",
    sortOrder: 5,
    isActive: true
  }
];

const blogCategories = [
  {
    name: "Chăm Sóc Da",
    description: "Mẹo và hướng dẫn chăm sóc da khỏe mạnh",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400",
    icon: "🧴",
    color: "#87CEEB",
    sortOrder: 1,
    isActive: true
  },
  {
    name: "Trang Điểm",
    description: "Hướng dẫn trang điểm từ cơ bản đến nâng cao",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
    icon: "💅",
    color: "#FFB6C1",
    sortOrder: 2,
    isActive: true
  },
  {
    name: "Đánh Giá Sản Phẩm",
    description: "Review chi tiết các sản phẩm mỹ phẩm",
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400",
    icon: "⭐",
    color: "#FFD700",
    sortOrder: 3,
    isActive: true
  },
  {
    name: "Mẹo Làm Đẹp",
    description: "Bí quyết và mẹo làm đẹp từ chuyên gia",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
    icon: "💡",
    color: "#98FB98",
    sortOrder: 4,
    isActive: true
  },
  {
    name: "Hướng Dẫn",
    description: "Tutorial trang điểm và chăm sóc da",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400",
    icon: "📚",
    color: "#DDA0DD",
    sortOrder: 5,
    isActive: true
  }
];

async function updateCategories() {
  try {
    console.log('🌱 Starting category update...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');
    console.log('✅ Connected to MongoDB');

    // Find an admin user to be the creator
    const User = require('../models/User');
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    console.log(`👤 Using admin user: ${adminUser.username}`);

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️ Cleared existing categories');

    // Add createdBy to all categories
    const productCategoriesWithCreator = productCategories.map(cat => ({
      ...cat,
      createdBy: adminUser._id
    }));

    const blogCategoriesWithCreator = blogCategories.map(cat => ({
      ...cat,
      createdBy: adminUser._id
    }));

    // Create product categories
    const createdProductCategories = await Category.insertMany(productCategoriesWithCreator);
    console.log(`✅ Created ${createdProductCategories.length} product categories`);

    // Create blog categories
    const createdBlogCategories = await Category.insertMany(blogCategoriesWithCreator);
    console.log(`✅ Created ${createdBlogCategories.length} blog categories`);

    // Display created categories
    console.log('\n📦 Product Categories:');
    createdProductCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.icon} ${category.name} (${category.color})`);
    });

    console.log('\n📝 Blog Categories:');
    createdBlogCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.icon} ${category.name} (${category.color})`);
    });

    console.log('\n🎉 Category update completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating categories:', error);
    process.exit(1);
  }
}

// Run the update function
updateCategories();
