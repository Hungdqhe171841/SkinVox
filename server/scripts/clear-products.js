const mongoose = require('mongoose');
const Lipstick = require('../models/Lipstick');
const Eyeshadow = require('../models/Eyeshadow');
const Blush = require('../models/Blush');
const Eyebrows = require('../models/Eyebrows');
const Eyeliner = require('../models/Eyeliners');
require('dotenv').config();

async function clearProducts() {
  try {
    console.log('🗑️ Clearing all BeautyBar products...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');
    console.log('✅ Connected to MongoDB');

    const results = await Promise.all([
      Lipstick.deleteMany({}),
      Eyeshadow.deleteMany({}),
      Blush.deleteMany({}),
      Eyebrows.deleteMany({}),
      Eyeliner.deleteMany({})
    ]);

    console.log(`✔️ Deleted: lipsticks=${results[0].deletedCount}, eyeshadows=${results[1].deletedCount}, blushes=${results[2].deletedCount}, eyebrows=${results[3].deletedCount}, eyeliners=${results[4].deletedCount}`);

    const [lc, ec, bc, ebc, elc] = await Promise.all([
      Lipstick.countDocuments({}),
      Eyeshadow.countDocuments({}),
      Blush.countDocuments({}),
      Eyebrows.countDocuments({}),
      Eyeliner.countDocuments({})
    ]);

    console.log(`📊 Remaining counts -> lipsticks=${lc}, eyeshadows=${ec}, blushes=${bc}, eyebrows=${ebc}, eyeliners=${elc}`);
    console.log('🎉 All BeautyBar products cleared.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing products:', err);
    process.exit(1);
  }
}

clearProducts();
