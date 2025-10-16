const mongoose = require('mongoose');
const Lipstick = require('../models/Lipstick');
const Eyeshadow = require('../models/Eyeshadow');
const Blush = require('../models/Blush');
const Eyebrows = require('../models/Eyebrows');
const Eyeliner = require('../models/Eyeliners');
require('dotenv').config();

const sampleLipsticks = [
  {
    name: "Ruby Red Matte",
    brand: "MAC",
    color: "Ruby Red",
    shade: "Classic Red",
    price: 25.99,
    description: "Long-lasting matte lipstick with intense color payoff",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    category: "matte",
    rating: 4.5,
    shades: {
      "Classic Red": "#DC143C",
      "Ruby Wine": "#B22222",
      "Deep Rose": "#C71585",
      "Coral Red": "#FF7F50"
    }
  },
  {
    name: "Nude Glow",
    brand: "Fenty Beauty",
    color: "Nude",
    shade: "Warm Nude",
    price: 22.99,
    description: "Perfect nude shade for everyday wear",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    category: "satin",
    rating: 4.3,
    shades: {
      "Warm Nude": "#D2B48C",
      "Cool Nude": "#F5DEB3",
      "Pink Nude": "#F0B6C1",
      "Brown Nude": "#8B4513"
    }
  },
  {
    name: "Berry Bomb",
    brand: "Urban Decay",
    color: "Deep Berry",
    shade: "Wine",
    price: 28.99,
    description: "Rich berry shade perfect for evening looks",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    category: "matte",
    rating: 4.7
  },
  {
    name: "Coral Crush",
    brand: "NARS",
    color: "Coral",
    shade: "Sunset Coral",
    price: 32.99,
    description: "Vibrant coral shade for summer looks",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    category: "cream",
    rating: 4.4
  },
  {
    name: "Pink Perfection",
    brand: "Charlotte Tilbury",
    color: "Pink",
    shade: "Rose Pink",
    price: 35.99,
    description: "Elegant pink shade with subtle shimmer",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    category: "glossy",
    rating: 4.6
  }
];

const sampleEyeshadows = [
  {
    name: "Naked Palette",
    brand: "Urban Decay",
    palette: "Naked 3",
    colors: [
      { name: "Strange", hex: "#F4F1E8", finish: "matte" },
      { name: "Dust", hex: "#E8A798", finish: "shimmer" },
      { name: "Burnout", hex: "#E8A798", finish: "satin" }
    ],
    price: 54.99,
    description: "Iconic neutral eyeshadow palette with 12 shades",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400",
    rating: 4.8
  },
  {
    name: "Chocolate Bar",
    brand: "Too Faced",
    palette: "Chocolate Bar",
    colors: [
      { name: "White Chocolate", hex: "#F5F5DC", finish: "matte" },
      { name: "Milk Chocolate", hex: "#D2B48C", finish: "matte" },
      { name: "Semi-Sweet", hex: "#8B4513", finish: "shimmer" }
    ],
    price: 49.99,
    description: "Delicious chocolate-themed eyeshadow palette",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400",
    rating: 4.6
  },
  {
    name: "Modern Renaissance",
    brand: "Anastasia Beverly Hills",
    palette: "Modern Renaissance",
    colors: [
      { name: "Tempera", hex: "#F5F5DC", finish: "matte" },
      { name: "Golden Ochre", hex: "#DAA520", finish: "matte" },
      { name: "Vermeer", hex: "#F0E68C", finish: "shimmer" }
    ],
    price: 42.99,
    description: "Inspired by Renaissance art with warm, romantic tones",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400",
    rating: 4.9
  }
];

const sampleBlushes = [
  {
    name: "Orgasm",
    brand: "NARS",
    color: "Peachy Pink",
    shade: "Orgasm",
    price: 30.99,
    description: "Iconic peachy-pink blush with golden shimmer",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    type: "powder",
    skinTone: ["fair", "light", "medium"],
    rating: 4.7
  },
  {
    name: "Dusty Rose",
    brand: "Tarte",
    color: "Dusty Rose",
    shade: "Natural Rose",
    price: 28.99,
    description: "Natural rose shade for a healthy flush",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    type: "powder",
    skinTone: ["light", "medium", "tan"],
    rating: 4.4
  },
  {
    name: "Coral Glow",
    brand: "Benefit",
    color: "Coral",
    shade: "Coralista",
    price: 29.99,
    description: "Bright coral blush for a sun-kissed look",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    type: "powder",
    skinTone: ["medium", "tan", "dark"],
    rating: 4.5
  }
];

const sampleEyebrows = [
  {
    name: "Brow Wiz",
    brand: "Anastasia Beverly Hills",
    color: "Dark Brown",
    shade: "Dark Brown",
    price: 23.99,
    description: "Precision eyebrow pencil for natural-looking brows",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    type: "pencil",
    rating: 4.6
  },
  {
    name: "Brow Gel",
    brand: "Glossier",
    color: "Clear",
    shade: "Clear",
    price: 18.99,
    description: "Clear brow gel for natural, fluffy brows",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    type: "gel",
    rating: 4.3
  }
];

const sampleEyeliners = [
  {
    name: "Liquid Liner",
    brand: "Stila",
    color: "Black",
    shade: "Intense Black",
    price: 22.99,
    description: "Long-wearing liquid eyeliner with precision tip",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    type: "liquid",
    rating: 4.5
  },
  {
    name: "Gel Liner",
    brand: "Bobbi Brown",
    color: "Black",
    shade: "Black Ink",
    price: 26.99,
    description: "Creamy gel eyeliner for smooth application",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    type: "gel",
    rating: 4.4
  }
];

async function seedBeutBarProducts() {
  try {
    console.log('🌱 Starting BeutBar product seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Lipstick.deleteMany({});
    await Eyeshadow.deleteMany({});
    await Blush.deleteMany({});
    await Eyebrows.deleteMany({});
    await Eyeliner.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Create sample products
    const createdLipsticks = await Lipstick.insertMany(sampleLipsticks);
    const createdEyeshadows = await Eyeshadow.insertMany(sampleEyeshadows);
    const createdBlushes = await Blush.insertMany(sampleBlushes);
    const createdEyebrows = await Eyebrows.insertMany(sampleEyebrows);
    const createdEyeliners = await Eyeliner.insertMany(sampleEyeliners);

    console.log(`✅ Created ${createdLipsticks.length} lipsticks`);
    console.log(`✅ Created ${createdEyeshadows.length} eyeshadows`);
    console.log(`✅ Created ${createdBlushes.length} blushes`);
    console.log(`✅ Created ${createdEyebrows.length} eyebrow products`);
    console.log(`✅ Created ${createdEyeliners.length} eyeliners`);

    // Display created products
    console.log('\n💄 Created Lipsticks:');
    createdLipsticks.forEach((product, index) => {
      console.log(`${index + 1}. ${product.brand} ${product.name} - $${product.price}`);
    });

    console.log('\n👁️ Created Eyeshadows:');
    createdEyeshadows.forEach((product, index) => {
      console.log(`${index + 1}. ${product.brand} ${product.name} - $${product.price}`);
    });

    console.log('\n🌸 Created Blushes:');
    createdBlushes.forEach((product, index) => {
      console.log(`${index + 1}. ${product.brand} ${product.name} - $${product.price}`);
    });

    console.log('\n👁️‍🗨️ Created Eyebrow Products:');
    createdEyebrows.forEach((product, index) => {
      console.log(`${index + 1}. ${product.brand} ${product.name} - $${product.price}`);
    });

    console.log('\n✏️ Created Eyeliners:');
    createdEyeliners.forEach((product, index) => {
      console.log(`${index + 1}. ${product.brand} ${product.name} - $${product.price}`);
    });

    console.log('\n🎉 BeutBar product seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding BeutBar products:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedBeutBarProducts();
